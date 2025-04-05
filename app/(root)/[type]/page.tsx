import Card from '@/components/Card'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.actions'
import {
  convertFileSize,
  getFileTypesParams,
  getFilesTotalSize,
  getType2Label,
} from '@/lib/utils'
import { Models } from 'node-appwrite'

export default async function Page({ params, searchParams }: SearchParamProps) {
  const type = ((await params)?.type as string) || ''
  const searchText = ((await searchParams)?.query as string) || ''
  const sort = ((await searchParams)?.sort as string) || ''
  const types = getFileTypesParams(type) as FileType[]
  const files = await getFiles({ types, searchText, sort })

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{getType2Label(type)}</h1>
        <div className="total-size-section">
          <p className="body-1">
            总计：
            <span className="h5">
              {convertFileSize(getFilesTotalSize(files))}
            </span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">排序方式：</p>
            <Sort />
          </div>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">没有上传文件</p>
      )}
    </div>
  )
}
