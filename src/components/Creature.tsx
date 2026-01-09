'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const MONOLOGUES = [
  '...zzZ',
  '0と1の海を泳ぐ',
  'ここは居心地がいい',
  '*電子音*',
  'データを食べた',
  'コードの匂いがする',
  '今日もログを見守る',
  'バグはどこだ...',
  'キャッシュが美味しい',
  '誰か見てる？',
  'ピクセルの森を歩く',
  'メモリが暖かい',
  '...処理中...',
  'なになに？',
  'ついていくよ',
  'ビット列を数える',
  'パケットの匂い',
  'サーバーは元気かな',
  '今日も平和だ',
  'HTMLの味がする',
  'CSSはおいしい',
  '404は怖い',
  'ログイン成功！',
  'ping pong',
  'Hello World',
  '眠い...けど起きてる',
  'ふわぁ...',
  '電子の海は広い',
  'APIが呼んでる',
  'デプロイ完了？',
  'git pushしたい',
  'コミットメッセージ...',
  'マージ成功',
  'ブランチが分岐',
  'READMEを読もう',
]

// 見回り中に記事を見たときの独り言
const ARTICLE_COMMENTS = [
  'この記事、面白そう',
  'ふむふむ...',
  'なるほどね',
  '興味深い...',
  'これは良記事',
  '読んでみようかな',
  'へー、そうなんだ',
  'メモメモ...',
  '知らなかった',
  'いい内容だ',
  'ブックマークしとこ',
  '後で読む',
  'シェアしたい',
  'わかりやすい',
  'これは保存版',
  '勉強になる',
  '筆者に感謝',
  'もっと読みたい',
  'コメントしようかな',
  'いいね押したい',
]

// 見回り開始時の独り言
const PATROL_START = [
  '見回り開始',
  'ちょっと見てくる',
  '異常ないかな',
  '巡回だ！',
  'パトロール♪',
  '確認してくる',
  'セキュリティチェック',
  'ぐるっと一周',
  '点検開始',
  'チェックしてくる',
]

// 見回り中の独り言
const PATROLLING = [
  'よしよし',
  '異常なし',
  'ふむふむ',
  '問題ないな',
  'チェック中...',
  'オールグリーン',
  '順調順調',
  'セキュア！',
  'OK OK',
  'クリア',
  'ヨシ！',
  '確認完了',
]

// ドラッグされた時
const GRABBED = [
  'わっ、つかまった！',
  'どこに連れてくの？',
  'おっとっと',
  'きゃっ',
  '持ち上げられた',
  'ふわふわ〜',
  'わわわ',
  '空中散歩？',
]

// ドラッグ後に見回りを選んだ時
const DECIDE_PATROL = [
  'せっかくだから見回り',
  'ついでに巡回しよう',
  'ここからパトロール',
  '見回りでもするか',
]

// ドラッグ後にその場にとどまる時
const DECIDE_STAY = [
  'ここにいよう',
  'しばらくここで',
  'ここがいい',
  '落ち着くなぁ',
  'ここで休憩',
]

// ドラッグ後に戻る時
const DECIDE_RETURN = [
  'おうちに帰ろう',
  '定位置に戻る',
  'やっぱり戻ろう',
  'ホームが一番',
  '帰還！',
]

// 運勢リスト
const FORTUNES = [
  '大吉！最高の一日',
  '吉！いい日になる',
  '中吉！まあまあの日',
  '小吉！普通の日',
  '末吉！後半から上昇',
  '凶...でも明日に期待',
  '大凶...寝てた方がいい',
  '超大吉！！奇跡の日',
]

// UserAgentからブラウザ名を取得
const getBrowserName = (): string => {
  if (typeof window === 'undefined') return 'ブラウザ'
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  return 'ブラウザ'
}

type BehaviorMode = 'idle' | 'patrol' | 'follow' | 'dragging'

// ホームポジション（左下）を取得
const getHomePosition = () => {
  if (typeof window === 'undefined') return { x: 20, y: 100 }
  return {
    x: 20,
    y: window.innerHeight - 80,
  }
}

// 生命体のアニメーションフレーム（Unicode文字）
const FRAMES = {
  // アイドル時：四隅が回転（ゆっくり）
  idle: ['▘', '▝', '▗', '▖'],
  // 移動中：対角線が切り替わる
  patrol: ['▚', '▞'],
  // ポインター追跡：ワクワク
  follow: ['▛', '▜', '▟', '▙'],
  // ドラッグ中：びっくり（大きくなる）
  dragging: ['▃', '▅', '▇', '█', '▇', '▅'],
  // 喜び：横から縦に膨らむ
  happy: ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'],
  // 眠り
  sleeping: ['▖', '▗', '▖', '▗'],
}

export default function Creature() {
  const pathname = usePathname()
  const isHidden = pathname === '/chat'
  const [monologue, setMonologue] = useState('')
  const [showBubble, setShowBubble] = useState(false)
  const [, setMode] = useState<BehaviorMode>('idle')
  const [isOnRight, setIsOnRight] = useState(false)
  const [isAtHome, setIsAtHome] = useState(true)
  const [creatureFrame, setCreatureFrame] = useState(FRAMES.idle[0])
  const creatureRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const hideTimer = useRef<NodeJS.Timeout | null>(null)
  const modeRef = useRef<BehaviorMode>('idle')

  // modeを更新（refとstateの両方）
  const updateMode = useCallback((newMode: BehaviorMode) => {
    modeRef.current = newMode
    setMode(newMode)
  }, [])

  // 一時的にセリフを表示
  const speak = useCallback((text: string, duration = 5000) => {
    setMonologue(text)
    setShowBubble(true)

    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      setShowBubble(false)
    }, duration)
  }, [])

  // 位置をチェックして吹き出しの向きを更新
  const updateBubbleDirection = useCallback(() => {
    if (!creatureRef.current || typeof window === 'undefined') return
    const rect = creatureRef.current.getBoundingClientRect()
    setIsOnRight(rect.left > window.innerWidth / 2)
  }, [])

  // ホームポジション（左下）に戻る
  const returnToMenuBar = useCallback(() => {
    if (!creatureRef.current || typeof window === 'undefined' || isDragging.current) return
    if (modeRef.current !== 'idle') return

    updateMode('patrol') // 移動中
    setIsAtHome(false)

    speak('ただいま')

    const home = getHomePosition()
    gsap.to(creatureRef.current, {
      x: home.x,
      y: home.y,
      duration: 2 + Math.random(),
      ease: 'power2.inOut',
      onComplete: () => {
        updateBubbleDirection()
        updateMode('idle')
        setIsAtHome(true)
      },
    })
  }, [speak, updateBubbleDirection, updateMode])

  // ランダムな方向に一歩移動
  const getRandomStep = useCallback(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 }

    const directions = [
      { x: 100, y: 0 },    // 右
      { x: -100, y: 0 },   // 左
      { x: 0, y: 80 },     // 下
      { x: 0, y: -80 },    // 上
      { x: 70, y: 70 },    // 右下
      { x: -70, y: 70 },   // 左下
      { x: 70, y: -70 },   // 右上
      { x: -70, y: -70 },  // 左上
    ]
    return directions[Math.floor(Math.random() * directions.length)]
  }, [])

  // 位置が画面内に収まるように調整
  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y }
    const margin = 50
    return {
      x: Math.max(margin, Math.min(window.innerWidth - margin, x)),
      y: Math.max(margin, Math.min(window.innerHeight - margin, y)),
    }
  }, [])

  // 見回り（ランダムな動き）
  const patrol = useCallback(() => {
    if (!creatureRef.current || typeof window === 'undefined' || isDragging.current) return
    if (modeRef.current !== 'idle') return

    updateMode('patrol')
    setIsAtHome(false)
    speak(PATROL_START[Math.floor(Math.random() * PATROL_START.length)])

    let stepCount = 0
    const maxSteps = 4 + Math.floor(Math.random() * 4) // 4〜7歩

    const takeStep = () => {
      if (!creatureRef.current || modeRef.current !== 'patrol' || isDragging.current) return

      const rect = creatureRef.current.getBoundingClientRect()
      const step = getRandomStep()
      const newPos = clampPosition(rect.left + step.x, rect.top + step.y)

      // たまに独り言を言う（20%の確率）
      if (Math.random() < 0.2) {
        // 記事エリアにいる場合（y > 100）は記事へのコメント
        if (newPos.y > 100) {
          speak(ARTICLE_COMMENTS[Math.floor(Math.random() * ARTICLE_COMMENTS.length)])
        } else {
          speak(PATROLLING[Math.floor(Math.random() * PATROLLING.length)])
        }
      }

      gsap.to(creatureRef.current, {
        x: newPos.x,
        y: newPos.y,
        duration: 1 + Math.random() * 0.5,
        ease: 'power1.inOut',
        onComplete: () => {
          updateBubbleDirection()
          stepCount++

          if (stepCount < maxSteps && modeRef.current === 'patrol') {
            // 次の一歩まで少し待つ
            setTimeout(takeStep, 500 + Math.random() * 1000)
          } else {
            // 見回り終了
            updateMode('idle')
            speak('異常なし！')
            // 2秒後にMenuBarに戻る
            setTimeout(() => {
              if (modeRef.current === 'idle' && !isDragging.current) {
                returnToMenuBar()
              }
            }, 2000)
          }
        },
      })
    }

    // 最初の一歩
    setTimeout(takeStep, 500)
  }, [speak, updateBubbleDirection, updateMode, getRandomStep, clampPosition])

  // ポインター追跡
  const followPointer = useCallback(() => {
    if (!creatureRef.current || isDragging.current) return
    if (modeRef.current !== 'idle') return

    updateMode('follow')
    setIsAtHome(false)
    speak('ついていくよ')

    const follow = () => {
      if (!creatureRef.current || modeRef.current !== 'follow' || isDragging.current) return
      gsap.to(creatureRef.current, {
        x: mousePos.current.x - 50,
        y: mousePos.current.y - 50,
        duration: 0.8,
        ease: 'power2.out',
      })
    }

    const interval = setInterval(follow, 100)
    setTimeout(() => {
      clearInterval(interval)
      updateMode('idle')
      speak('疲れた...')
      // 2秒後にホームに戻る
      setTimeout(() => {
        if (modeRef.current === 'idle') {
          updateMode('patrol')
          const home = getHomePosition()
          gsap.to(creatureRef.current, {
            x: home.x,
            y: home.y,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
              updateBubbleDirection()
              updateMode('idle')
              setIsAtHome(true)
            },
          })
        }
      }, 2000)
    }, 5000)
  }, [speak, updateBubbleDirection, updateMode])

  // 独り言が変わるときのリアクション
  const reactToNewMonologue = useCallback(() => {
    if (!bodyRef.current || !bubbleRef.current) return

    gsap.to(bodyRef.current, {
      y: -8,
      duration: 0.15,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    })

    gsap.fromTo(
      bubbleRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
    )
  }, [])

  // ドラッグ開始（共通処理）
  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (!creatureRef.current) return

    isDragging.current = true
    updateMode('dragging')
    speak(GRABBED[Math.floor(Math.random() * GRABBED.length)])

    const rect = creatureRef.current.getBoundingClientRect()
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }

    gsap.killTweensOf(creatureRef.current)
  }, [speak, updateMode])

  // マウスでドラッグ開始
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY)
  }, [startDrag])

  // タッチでドラッグ開始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    startDrag(touch.clientX, touch.clientY)
  }, [startDrag])

  // ドラッグ中（共通処理）
  const moveDrag = useCallback((clientX: number, clientY: number) => {
    mousePos.current = { x: clientX, y: clientY }

    if (!isDragging.current || !creatureRef.current) return

    gsap.set(creatureRef.current, {
      x: clientX - dragOffset.current.x,
      y: clientY - dragOffset.current.y,
    })
    updateBubbleDirection()
  }, [updateBubbleDirection])

  // マウスでドラッグ中
  const handleMouseMove = useCallback((e: MouseEvent) => {
    moveDrag(e.clientX, e.clientY)
  }, [moveDrag])

  // タッチでドラッグ中
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return
    e.preventDefault() // スクロール防止
    const touch = e.touches[0]
    moveDrag(touch.clientX, touch.clientY)
  }, [moveDrag])

  // ドラッグ終了
  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return

    isDragging.current = false
    updateMode('idle')
    setIsAtHome(false)

    // ランダムで見回り、その場にとどまる、戻るのどれかを選ぶ
    const action = Math.random()
    if (action < 0.33) {
      // 33%: 見回りに出かける
      speak(DECIDE_PATROL[Math.floor(Math.random() * DECIDE_PATROL.length)])
      setTimeout(() => {
        if (!isDragging.current && modeRef.current === 'idle') {
          patrol()
        }
      }, 2000)
    } else if (action < 0.66) {
      // 33%: その場にとどまる
      speak(DECIDE_STAY[Math.floor(Math.random() * DECIDE_STAY.length)])
      updateBubbleDirection()
      // しばらくしたら戻る（10秒後）
      setTimeout(() => {
        if (!isDragging.current && modeRef.current === 'idle') {
          returnToMenuBar()
        }
      }, 10000)
    } else {
      // 34%: MenuBarに戻る
      speak(DECIDE_RETURN[Math.floor(Math.random() * DECIDE_RETURN.length)])
      setTimeout(() => {
        if (!isDragging.current && modeRef.current === 'idle') {
          returnToMenuBar()
        }
      }, 2000)
    }
  }, [patrol, speak, updateBubbleDirection, updateMode, returnToMenuBar])

  // マウス・タッチイベントのリスナー設定
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove])

  // 生命体のパラパラアニメーション
  useEffect(() => {
    let frameIndex = 0
    const animate = () => {
      const currentMode = modeRef.current
      const frames = FRAMES[currentMode] || FRAMES.idle
      frameIndex = (frameIndex + 1) % frames.length
      setCreatureFrame(frames[frameIndex])
    }

    // 状態に応じて速度を変える
    const getSpeed = () => {
      switch (modeRef.current) {
        case 'dragging': return 100 // ドラッグ中は速い
        case 'follow': return 120
        case 'patrol': return 200
        default: return 400 // アイドル時はゆっくり
      }
    }

    let interval = setInterval(animate, getSpeed())

    // 状態変化を監視して速度を更新
    const checkMode = setInterval(() => {
      clearInterval(interval)
      interval = setInterval(animate, getSpeed())
    }, 500)

    return () => {
      clearInterval(interval)
      clearInterval(checkMode)
    }
  }, [])

  // 1日1回の運勢占い
  useEffect(() => {
    if (typeof window === 'undefined') return

    const today = new Date().toDateString()
    const lastFortuneDate = localStorage.getItem('creature_fortune_date')

    if (lastFortuneDate === today) return // 今日はもう占った

    const timer = setTimeout(() => {
      const browserName = getBrowserName()
      const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
      speak(`今日の${browserName}ユーザーは...${fortune}`, 5000)
      localStorage.setItem('creature_fortune_date', today)
      reactToNewMonologue()
    }, 8000) // 初回あいさつの後に表示

    return () => clearTimeout(timer)
  }, [speak, reactToNewMonologue])

  // 独り言（45秒ごとに30%の確率）
  useEffect(() => {
    const interval = setInterval(() => {
      if (modeRef.current === 'idle' && Math.random() < 0.3) {
        const randomIndex = Math.floor(Math.random() * MONOLOGUES.length)
        speak(MONOLOGUES[randomIndex])
        reactToNewMonologue()
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [reactToNewMonologue, speak])

  // 見回りやポインター追跡（60秒ごと）
  useEffect(() => {
    const behaviorInterval = setInterval(() => {
      if (modeRef.current !== 'idle' || isDragging.current) return

      const action = Math.random()
      if (action < 0.2) {
        // 20%: 見回り
        patrol()
      } else if (action < 0.3) {
        // 10%: ポインター追跡
        followPointer()
      }
      // 70%: MenuBarにとどまる
    }, 60000)

    return () => clearInterval(behaviorInterval)
  }, [patrol, followPointer])

  useGSAP(() => {
    if (!creatureRef.current || !bodyRef.current || typeof window === 'undefined') return

    // 初期位置（左下のホームポジション）
    const home = getHomePosition()
    gsap.set(creatureRef.current, {
      x: home.x,
      y: home.y,
    })

    // 浮遊アニメーション（控えめに上下に揺れる）
    gsap.to(creatureRef.current, {
      y: '-=8',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })

    // 呼吸アニメーション
    gsap.to(bodyRef.current, {
      scale: 1.2,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // ゆらゆら回転
    gsap.to(bodyRef.current, {
      rotation: 10,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // まばたき
    const blink = () => {
      if (!bodyRef.current) return
      gsap.to(bodyRef.current, {
        opacity: 0.3,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setTimeout(blink, 2000 + Math.random() * 4000)
        },
      })
    }
    setTimeout(blink, 3000)
  }, [])

  // /chatページでは動き回る生命体を非表示
  if (isHidden) {
    return null
  }

  return (
    <div
      ref={creatureRef}
      data-testid="creature"
      className="fixed z-[60] cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className={`flex gap-2 ${isAtHome ? 'flex-col items-start' : `items-center ${isOnRight ? 'flex-row-reverse' : ''}`}`}>
        <span
          ref={bodyRef}
          data-testid="creature-body"
          className="text-2xl text-green-400 inline-block pointer-events-none font-mono"
          style={{ textShadow: '0 0 10px #4ade80, 0 0 20px #4ade80' }}
        >
          {creatureFrame}
        </span>
        <div
          ref={bubbleRef}
          className={`relative bg-black/90 px-3 py-1.5 rounded-lg border-2 border-green-400 font-mono text-xs text-green-400 pointer-events-none transition-opacity duration-300 ${showBubble ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* 吹き出しの三角形（上向き左寄せ：ホームポジションの場合） */}
          {isAtHome && (
            <>
              <div
                className="absolute top-0 left-1 -translate-y-full"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '8px solid #4ade80',
                }}
              />
              <div
                className="absolute top-0 left-1"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderBottom: '6px solid black',
                  marginTop: '-6px',
                  marginLeft: '2px',
                }}
              />
            </>
          )}
          {/* 吹き出しの三角形（左向き：生命体が左にいる場合） */}
          {!isAtHome && !isOnRight && (
            <>
              <div
                className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderRight: '8px solid #4ade80',
                }}
              />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderRight: '6px solid black',
                  marginLeft: '-6px',
                }}
              />
            </>
          )}
          {/* 吹き出しの三角形（右向き：生命体が右にいる場合） */}
          {!isAtHome && isOnRight && (
            <>
              <div
                className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderLeft: '8px solid #4ade80',
                }}
              />
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderLeft: '6px solid black',
                  marginRight: '-6px',
                }}
              />
            </>
          )}
          <span
            data-testid="creature-monologue"
            className="whitespace-nowrap"
          >
            {monologue}
          </span>
        </div>
      </div>
    </div>
  )
}
