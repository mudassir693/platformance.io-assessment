export const MessageSkeleton = () => (
    <div className={`flex items-end "justify-start space-x-2 px-3 mb-4 animate-pulse`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div
        className={`relative max-w-[70%] w-48 h-10 rounded-2xl bg-gray-200 dark:bg-gray-700`}
      />
    </div>
  )