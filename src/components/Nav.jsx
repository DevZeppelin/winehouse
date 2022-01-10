import React from 'react'

const Nav = () => {

    const format = (date,locale,options) => 
        new Intl.DateTimeFormat(locale,options).format(date)    

    const now = new Date()    

    return (
        <div className='grid grid-cols-2 text-background bg-darkBlue font-extrabold text-center py-1 text-base'>
            <span className='flex justify-start ml-4 text-lightBlue'>{format(now, 'es', { dateStyle: 'long' })}</span>
            <div className='nav flex gap-4 justify-end mr-6 '>
                <p className='hidden md:flex'>Dólar Oficial<p className='pl-1 text-lightBlue'>$154</p></p>
                <p className='flex'>Dólar Blue <p className='pl-1 text-lightBlue'>$206</p></p>
                <p className='hidden md:flex'>Bitcoin <p className='pl-1 text-lightBlue'>$9M</p></p>
            </div>
            
        </div>
    )
}

export default Nav
