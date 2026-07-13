export default function BlogsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14 space-y-4">
          <div className="h-12 w-56 rounded bg-muted animate-pulse mx-auto" />
          <div className="h-5 w-3/4 max-w-2xl rounded bg-muted animate-pulse mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-xl border bg-card p-4 animate-pulse">
              <div className="h-48 rounded-md bg-muted" />
              <div className="h-6 w-4/5 bg-muted rounded mt-4" />
              <div className="h-4 w-full bg-muted rounded mt-3" />
              <div className="h-4 w-2/3 bg-muted rounded mt-2" />
              <div className="h-10 w-full bg-muted rounded mt-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
