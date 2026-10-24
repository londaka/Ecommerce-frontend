const Loading = () => {
  return (
    <div
      className='flex min-h-[60vh] w-full items-center justify-center'
      role='status'
      aria-label='Loading'
    >
      <div className='h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-blue-400'>
        <div className='h-full w-full animate-spin rounded-full border-4 border-transparent border-t-red-400' />
      </div>
    </div>
  )
}

export default Loading