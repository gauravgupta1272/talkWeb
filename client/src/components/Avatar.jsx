import React from 'react'

export default function Avatar({userId, username, online}) {
    const colors = ['bg-fuchsia-200','bg-green-200', 'bg-red-200', 'bg-blue-200','bg-purple-200', 'bg-yellow-200','bg-orange-200' ,'bg-teal-200',' bg-amber-200']
    const userIdBase10 = parseInt(userId,16);
    // console.log(userIdBase10 %colors.length);
    const colorIndex = userIdBase10 %colors.length;
    const color = colors[colorIndex]
    return (
    <div className={"w-8 h-8 relative rounded-full items-center flex border border-black-100 " + color}  >
       <div className='text-center w-full opacity-70'>{username[0]}</div> 
       {online && (
       <div className='absolute w-3 h-3 bottom-0 right-0 bg-green-500 rounded-full border border-white'></div>
       )}
    </div>
  )
}
