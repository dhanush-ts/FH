// "use client"

// import React, { useEffect, useRef } from 'react'
// import { gsap } from 'gsap'

// const MaskMouseEffect = ({
//   children,
//   targetClassName,
//   contrastColor = "#ffffff",
//   defaultColor = "#ff00ff",
//   scale = 1.5,
// }) => {
//   const containerRef = useRef(null)
//   const cursorRef = useRef(null)

//   useEffect(() => {
//     if (!containerRef.current || !cursorRef.current) return

//     const container = containerRef.current
//     const cursor = cursorRef.current
//     const targets = container.querySelectorAll(`.${targetClassName}`)

//     let mouseX = 0
//     let mouseY = 0
//     let cursorX = 0
//     let cursorY = 0

//     gsap.set(cursor, {
//       width: '20px',
//       height: '20px',
//       backgroundColor: defaultColor,
//       borderRadius: '50%',
//     })

//     const onMouseMove = (e) => {
//       mouseX = e.clientX
//       mouseY = e.clientY
//     }

//     const onMouseEnter = () => {
//       gsap.to(cursor, {
//         width: '50px',
//         height: '50px',
//         backgroundColor: contrastColor,
//         duration: 0.3,
//         ease: 'power2.out',
//       })
//     }

//     const onMouseLeave = () => {
//       gsap.to(cursor, {
//         width: '20px',
//         height: '20px',
//         backgroundColor: defaultColor,
//         duration: 0.3,
//         ease: 'power2.out',
//       })
//     }

//     targets.forEach((target) => {
//       target.addEventListener('mouseenter', onMouseEnter)
//       target.addEventListener('mouseleave', onMouseLeave)
//     })

//     container.addEventListener('mousemove', onMouseMove)

//     const tickerFunction = () => {
//       const dt = 1.0 - Math.pow(0.9, gsap.ticker.deltaRatio())
      
//       cursorX += (mouseX - cursorX) * dt
//       cursorY += (mouseY - cursorY) * dt
      
//       const dx = mouseX - cursorX
//       const dy = mouseY - cursorY
//       const angle = Math.atan2(dy, dx)
//       const distance = Math.sqrt(dx * dx + dy * dy)
//       const stretch = Math.min(distance * 0.3, 10)

//       gsap.set(cursor, {
//         x: cursorX,
//         y: cursorY,
//         rotation: angle * 180 / Math.PI,
//         scaleX: 1 + stretch * 0.03,
//         scaleY: 1 - stretch * 0.03,
//       })
//     }

//     gsap.ticker.add(tickerFunction)

//     return () => {
//       gsap.ticker.remove(tickerFunction)
//       container.removeEventListener('mousemove', onMouseMove)
//       targets.forEach((target) => {
//         target.removeEventListener('mouseenter', onMouseEnter)
//         target.removeEventListener('mouseleave', onMouseLeave)
//       })
//     }
//   }, [targetClassName, contrastColor, defaultColor, scale])

//   return (
//     <div ref={containerRef} className="relative overflow-hidden cursor-none">
//       {children}
//       <div
//         ref={cursorRef}
//         className="pointer-events-none fixed inset-0 z-50 mix-blend-difference"
//         style={{
//           width: '20px',
//           height: '20px',
//           transform: 'translate(-50%, -50%)',
//         }}
//       />
//     </div>
//   )
// }

// export default MaskMouseEffect
"use client"

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const MaskMouseEffect = ({
  children,
  targetClassName,
  contrastColor = "#ffffff",
  defaultColor = "#ff00ff",
  scale = 1.5,
}) => {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !cursorRef.current) return

    const container = containerRef.current
    const cursor = cursorRef.current
    const targets = document.querySelectorAll(`.${targetClassName}`)

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    gsap.set(cursor, {
      width: '20px',
      height: '20px',
      backgroundColor: defaultColor,
      borderRadius: '50%',
    })

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseEnter = () => {
      gsap.to(cursor, {
        width: '50px',
        height: '50px',
        backgroundColor: contrastColor,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const onMouseLeave = () => {
      gsap.to(cursor, {
        width: '20px',
        height: '20px',
        backgroundColor: defaultColor,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    targets.forEach((target) => {
      target.addEventListener('mouseenter', onMouseEnter)
      target.addEventListener('mouseleave', onMouseLeave)
    })

    window.addEventListener('mousemove', onMouseMove)

    const tickerFunction = () => {
      const dt = 1.0 - Math.pow(0.9, gsap.ticker.deltaRatio())
      
      cursorX += (mouseX - cursorX) * dt
      cursorY += (mouseY - cursorY) * dt
      
      const dx = mouseX - cursorX
      const dy = mouseY - cursorY
      const angle = Math.atan2(dy, dx)
      const distance = Math.sqrt(dx * dx + dy * dy)
      const stretch = Math.min(distance * 0.3, 10)

      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
        rotation: angle * 180 / Math.PI,
        scaleX: 1 + stretch * 0.03,
        scaleY: 1 - stretch * 0.03,
      })
    }

    gsap.ticker.add(tickerFunction)

    return () => {
      gsap.ticker.remove(tickerFunction)
      window.removeEventListener('mousemove', onMouseMove)
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', onMouseEnter)
        target.removeEventListener('mouseleave', onMouseLeave)
      })
    }
  }, [targetClassName, contrastColor, defaultColor, scale])

  return (
    <div ref={containerRef} className="relative cursor-none w-full h-full">
      {children}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference"
        style={{
          width: '20px',
          height: '20px',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}

export default MaskMouseEffect
