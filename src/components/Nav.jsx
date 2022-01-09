import React from 'react'

const Nav = () => {

    const format = (date,locale,options) => 
        new Intl.DateTimeFormat(locale,options).format(date)    

    const now = new Date()    

    return (
        <div className='nav grid grid-cols-2 text-background bg-darkBlue font-extrabold text-center py-1 text-base'>
            <span className='flex justify-start ml-4'>{format(now, 'es', { dateStyle: 'long' })}</span>
            <div className='flex gap-4 justify-end mr-6 uppercase '>
                <p className='hidden md:flex'>Dólar: $154</p>
                <p className='flex'>Dólar Blue: $206</p>
                <p className='hidden md:flex'>Bitcoin: $9M</p>
            </div>
            
        </div>
    )
}

export default Nav
