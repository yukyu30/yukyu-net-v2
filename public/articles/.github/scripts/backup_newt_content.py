import os
import json
import re
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import hashlib
import shutil
from urllib.parse import urlparse, quote, unquote

SPACE_UID = os.environ.get('NEWT_SPACE_UID')
APP_UID = os.environ.get('NEWT_APP_UID')
API_TOKEN = os.environ.get('NEWT_API_TOKEN')
ARTICLE_MODEL_UID = os.environ.get('NEWT_ARTICLE_MODEL_UID')

if not all([SPACE_UID, APP_UID, API_TOKEN, ARTICLE_MODEL_UID]):
    raise ValueError("環境変数が設定されていません。NEWT_SPACE_UID, NEWT_APP_UID, NEWT_API_TOKEN, NEWT_ARTICLE_MODEL_UIDが必要です。")

BASE_URL = f"https://{SPACE_UID}.cdn.newt.so/v1"

HEADERS = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

def fetch_contents(model_uid, query_params=None):
    """NewtのCDN APIからコンテンツを取得する"""
    url = f"{BASE_URL}/{APP_UID}/{model_uid}"
    
    params = {}
    if query_params:
        params.update(query_params)
    
    all_items = []
    has_more = True
    skip = 0
    limit = 100  # 一度に取得する最大件数
    
    while has_more:
        params['skip'] = skip
        params['limit'] = limit
        
        response = requests.get(url, headers=HEADERS, params=params)
        
        if response.status_code != 200:
            raise Exception(f"APIリクエストが失敗しました: {response.status_code} - {response.text}")
        
        data = response.json()
        items = data.get('items', [])
        all_items.extend(items)
        
        if len(items) < limit:
            has_more = False
        else:
            skip += limit
    
    return all_items

def get_content_slug(content):
    """コンテンツからslugを取得する"""
    slug_fields = ['slug', 'Slug', '_slug', 'path', 'url', 'permalink']
    
    for field in slug_fields:
        if field in content:
            return content[field]
    
    return content['_id']

def download_image(image_url, output_path):
    """画像をダウンロードして保存する"""
    try:
        if image_url.startswith('/'):
            image_url = f"https://{SPACE_UID}.cdn.newt.so{image_url}"
        
        # URLをパースしてパス部分をエンコード
        parsed_url = urlparse(image_url)
        path = parsed_url.path
        encoded_path = quote(path, safe='/%')
        
        # エンコードされたパスでURLを再構築
        encoded_url = parsed_url._replace(path=encoded_path).geturl()
        
        response = requests.get(encoded_url, stream=True)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                shutil.copyfileobj(response.raw, f)
            return True
        else:
            print(f"画像のダウンロードに失敗しました: {image_url} - ステータスコード: {response.status_code}")
            return False
    except Exception as e:
        print(f"画像のダウンロードでエラーが発生しました: {image_url} - {e}")
        return False

def generate_filename(url):
    """URLからファイル名を生成する"""
    parsed_url = urlparse(url)
    path = parsed_url.path
    
    # URLエンコードされている場合はデコードする
    decoded_path = unquote(path)
    filename = os.path.basename(decoded_path)
    
    # ファイル名がない、または短すぎる場合はハッシュを使用
    if not filename or len(filename) < 5:
        hash_object = hashlib.md5(url.encode())
        ext = os.path.splitext(path)[1] or '.jpg'  # 拡張子がない場合はjpgとする
        filename = f"{hash_object.hexdigest()[:10]}{ext}"
    
    # ファイル名に使えない文字を置換
    invalid_chars = ['\\', '/', ':', '*', '?', '"', '<', '>', '|']
    for char in invalid_chars:
        filename = filename.replace(char, '_')
        
    return filename

def process_content_body(content_body, slug_dir):
    """コンテンツ本文内の画像を処理する"""
    if isinstance(content_body, str):
        if re.search(r'<(?:img|figure|picture)', content_body):
            return process_html_content(content_body, slug_dir)
        elif re.search(r'!\[.*?\]\(.*?\)', content_body):
            return process_markdown_content(content_body, slug_dir)
        else:
            return content_body
    else:
        print(f"注意: リッチテキスト形式のコンテンツが検出されました。変換が必要な場合があります。")
        return json.dumps(content_body, ensure_ascii=False)

def process_html_content(html_content, slug_dir):
    """HTML内の画像を処理する"""
    soup = BeautifulSoup(html_content, 'html.parser')
    img_tags = soup.find_all('img')
    
    for img in img_tags:
        if img.get('src'):
            image_url = img['src']
            filename = generate_filename(image_url)
            image_path = os.path.join(slug_dir, filename)
            
            if download_image(image_url, image_path):
                img['src'] = filename
    
    return str(soup)

def process_markdown_content(md_content, slug_dir):
    """Markdown内の画像を処理する"""
    pattern = r'!\[(.*?)\]\((.*?)\)'
    
    def replace_image(match):
        alt_text = match.group(1)
        image_url = match.group(2)
        filename = generate_filename(image_url)
        image_path = os.path.join(slug_dir, filename)
        
        if download_image(image_url, image_path):
            return f"![{alt_text}]({filename})"
        else:
            return match.group(0)
    
    return re.sub(pattern, replace_image, md_content)

def save_content_as_markdown(content, repository_root):
    """コンテンツをMarkdownファイルとして保存する"""
    try:
        slug = get_content_slug(content)
        
        slug_dir = os.path.join(repository_root, slug)
        os.makedirs(slug_dir, exist_ok=True)
        
        md_file_path = os.path.join(slug_dir, 'index.md')
        
        if os.path.exists(md_file_path):
            print(f"既存のファイルをスキップ: {md_file_path}")
            return False
        
        metadata = {
            "id": content.get("_id", ""),
            "title": content.get("title", ""),
            "created_at": content.get("_sys", {}).get("createdAt", ""),
            "updated_at": content.get("_sys", {}).get("updatedAt", "")
        }
        
        body_fields = ["body", "content", "text", "description", "markdown", "html"]
        content_body = None
        
        for field in body_fields:
            if field in content:
                content_body = content[field]
                break
        
        if content_body is None:
            content_body = json.dumps(content, ensure_ascii=False)
        
        processed_body = process_content_body(content_body, slug_dir)
        
        with open(md_file_path, 'w', encoding='utf-8') as f:
            f.write("---\n")
            for key, value in metadata.items():
                f.write(f"{key}: {value}\n")
            f.write("---\n\n")
            
            f.write(processed_body)
        
        print(f"保存しました: {md_file_path}")
        return True
        
    except Exception as e:
        print(f"コンテンツの保存中にエラーが発生しました: {e}")
        return False

def main():
    """メイン処理"""
    try:
        repository_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        
        new_content_count = 0
        
        if ARTICLE_MODEL_UID:
            # テキスト形式で本文を取得するためのクエリパラメータを設定
            query_params = {
                'body[fmt]': 'text',
                'content[fmt]': 'text',
                'text[fmt]': 'text',
                'description[fmt]': 'text',
                'markdown[fmt]': 'text',
                'html[fmt]': 'text'
            }
            article_contents = fetch_contents(ARTICLE_MODEL_UID, query_params)
            print(f"{len(article_contents)}件の記事コンテンツを取得しました")
            
            for content in article_contents:
                if save_content_as_markdown(content, repository_root):
                    new_content_count += 1
        
        print(f"処理が完了しました。新しく保存されたコンテンツ: {new_content_count}件")
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        raise

if __name__ == "__main__":
    main()
