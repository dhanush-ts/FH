"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const Tabs = ({ tabs: propTabs, containerClassName, activeTabClassName, tabClassName, contentClassName }) => {
  const [active, setActive] = useState(propTabs[0])
  const [hoverTab, setHoverTab] = useState(null);
  const [tabs, setTabs] = useState(propTabs)

  const moveSelectedTabToTop = (idx) => {
    const newTabs = [...propTabs]
    const selectedTab = newTabs.splice(idx, 1)
    newTabs.unshift(selectedTab[0])
    setTabs(newTabs)
    setActive(newTabs[0])
  }

  const [hovering, setHovering] = useState(false)

  return (
    <>
            <div
        className={cn(
          "flex flex-row items-center justify-center bg-green-100 relative max-w-full w-fit m-auto p-1.5 rounded-full",
          containerClassName
        )}>
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => {
              setHovering(true);
              setHoverTab(tab.value);
            }}
            onMouseLeave={() => {
              setHovering(false);
              setHoverTab(null);
            }}
            className={cn(
              "relative px-2 cursor-pointer py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full transition-all mx-1",
              tabClassName
            )}
            style={{
              transformStyle: "preserve-3d",
            }}>
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-green-700 dark:bg-green-700 rounded-full",
                  activeTabClassName
                )} 
              />
            )}
            
            {hoverTab === tab.value && active.value !== tab.value && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full"
              />
            )}

            <span className={cn(
              "relative block", 
              active.value === tab.value 
                ? "text-white" 
                : "text-green-700 dark:text-green-400"
            )}>
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-8 max-w-7xl mx-auto">{tabs[0].content}</div>
    </>
  )
}

