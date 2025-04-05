'use client'

import Image from 'next/image'
import { use, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Models } from 'node-appwrite'
import { getFiles } from '@/lib/actions/file.actions'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { useDebounce } from 'use-debounce'

export default function Search() {
  const [query, setQuery] = useState('')
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') || ''
  const [results, setResults] = useState<Models.Document[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const path = usePathname()
  const [debouncedQuery] = useDebounce(query, 369)

  useEffect(() => {
    const fetchFiles = async () => {
      if (!query) {
        setResults([])
        setOpen(false)
        return router.push(path.replace(searchParams.toString(), ''))
      }
      const files = await getFiles({ types: [], searchText: debouncedQuery })
      setResults(files.documents)
      setOpen(true)
    }
    fetchFiles()
  }, [debouncedQuery])

  useEffect(() => {
    if (!searchQuery) {
      setQuery('')
    }
  }, [searchQuery])

  const handleClickItem = (file: Models.Document) => {
    setOpen(false)
    setResults([])

    router.push(
      `/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${query}`
    )
  }

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="在此搜索..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">没有找到文件</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
