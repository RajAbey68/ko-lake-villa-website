"use client"

import React from "react"
import Image from "next/image"

export default function VillaHeader() {
  return (
    <>
      <style jsx>{`
        .villa-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .villa-brand {
          display: flex;
          align-items: center;
        }

        .villa-thumbnail {
          width: 40px;
          height: 40px;
          object-fit: cover;
          margin-right: 12px;
          border-radius: 6px;
        }

        .villa-title {
          font-size: 1.4rem;
          font-weight: bold;
          color: #92400e; /* amber-700 to match your brand */
        }

        .villa-navbar {
          margin-top: 8px;
          width: 100%;
        }
      `}</style>
      
      <header className="villa-header">
        <div className="villa-brand">
          <Image 
            src="/images/sala-lake.jpg" 
            alt="Ko Lake Villa - Beautiful Lakeside Sala Pavilion" 
            width={40} 
            height={40} 
            className="villa-thumbnail" 
          />
          <span className="villa-title">Ko Lake Villa</span>
        </div>
        <nav className="villa-navbar">
          {/* Navigation links here */}
        </nav>
      </header>
    </>
  )
} 