import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { convertFileSize, formatDateTime } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
)

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
)

export function FileDetails({ file }: { file: Models.Document }) {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="格式：" value={file.extension} />
        <DetailRow label="大小：" value={convertFileSize(file.size)} />
        <DetailRow label="所有者：" value={file.owner.fullName} />
        <DetailRow label="更新于：" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  )
}

interface Props {
  file: Models.Document
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>
  onRemove: (email: string) => void
}

export function ShareInput({ file, onInputChange, onRemove }: Props) {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">分享给用户</p>
        <Input
          type="email"
          placeholder="输入电子邮箱"
          onChange={(e) => onInputChange(e.target.value.trim().split(','))}
          className="share-input-field"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">已分享到</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} 位用户
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src="assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
