export const navItems = [
  {
    name: '主页',
    icon: '/assets/icons/dashboard.svg',
    url: '/',
  },
  {
    name: '文档',
    icon: '/assets/icons/documents.svg',
    url: '/documents',
  },
  {
    name: '图片',
    icon: '/assets/icons/images.svg',
    url: '/images',
  },
  {
    name: '媒体',
    icon: '/assets/icons/video.svg',
    url: '/media',
  },
  {
    name: '其他',
    icon: '/assets/icons/others.svg',
    url: '/others',
  },
]

export const actionsDropdownItems = [
  {
    label: '重命名',
    icon: '/assets/icons/edit.svg',
    value: 'rename',
  },
  {
    label: '详情',
    icon: '/assets/icons/info.svg',
    value: 'details',
  },
  {
    label: '分享',
    icon: '/assets/icons/share.svg',
    value: 'share',
  },
  {
    label: '下载',
    icon: '/assets/icons/download.svg',
    value: 'download',
  },
  {
    label: '删除',
    icon: '/assets/icons/delete.svg',
    value: 'delete',
  },
]

export const sortTypes = [
  {
    label: '创建日期 (最新)',
    value: '$createdAt-desc',
  },
  {
    label: '创建日期 (最旧)',
    value: '$createdAt-asc',
  },
  {
    label: '文件名称 (升序)',
    value: 'name-asc',
  },
  {
    label: '文件名称 (降序)',
    value: 'name-desc',
  },
  {
    label: '文件大小 (降序)',
    value: 'size-desc',
  },
  {
    label: '文件大小 (升序)',
    value: 'size-asc',
  },
]

export const avatarPlaceholderUrl =
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
