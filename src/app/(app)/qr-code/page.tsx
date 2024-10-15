"use client"
import React from 'react'
import {QRCodeSVG} from 'qrcode.react'

export default function page() {
  return (
    <div className='h-screen flex justify-center items-center bg-white'>
    {/* QR Code  */}
    <div className=" bg-amber-400 w-1/2 h-1/2 flex justify-center items-center">
    <QRCodeSVG value="tilak" />
    </div>
    </div>
  )
}
