'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { actionsDropdownItems } from '@/constants'
import { constructDownloadUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Models } from 'node-appwrite'
import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from '@/lib/actions/file.actions'
import { FileDetails, ShareInput } from './ActionsModalContent'

export default function ActionsDropdown({ file }: { file: Models.Document }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)

  //用于重命名
  const [name, setName] = useState(file.name)

  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()

  //用于分享
  const [emails, setEmails] = useState<string[]>([])

  const closeAllModals = () => {
    setIsModalOpen(false)
    setIsDropdownOpen(false)
    setIsLoading(false)
    setAction(null)
    //setEmails
  }

  const handleActions = async () => {
    if (!action) return
    setIsLoading(true)
    let success = false

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, path, bucketFileId: file.bucketFileId }),
    }

    success = await actions[action.value as keyof typeof actions]()
    if (success) closeAllModals()
    setIsLoading(false)
  }

  //用于共享
  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email)
    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    })

    if (success) setEmails(updatedEmails)
    closeAllModals()
  }

  const renderDialogContent = () => {
    if (!action) return null

    const { label, value } = action

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === 'rename' && (
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          )}

          {value === 'details' && <FileDetails file={file} />}

          {value === 'share' && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}

          {value === 'delete' && (
            <p className="delete-confirmation">
              确定要删除{` `}
              <span className="delete-file-name">{file.name}</span>
              {` `}吗？
            </p>
          )}
        </DialogHeader>
        {['rename', 'share', 'delete'].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              取 消
            </Button>
            <Button onClick={handleActions} className="modal-submit-button">
              <p className="capitalize">{label}</p>
              {isLoading && (
                <Image
                  src="assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem)
                if (
                  ['rename', 'details', 'share', 'delete'].includes(
                    actionItem.value
                  )
                ) {
                  setIsModalOpen(true)
                }
              }}
            >
              {actionItem.value === 'download' ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  )
}
