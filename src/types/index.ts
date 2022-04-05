export interface WeExtractData {
  account_alias: string
  account_avatar: string
  account_description: string
  account_id: string
  account_biz: string
  account_biz_number: number
  account_qr_code: string
  msg_has_copyright: boolean
  msg_content: string
  msg_author?: string
  msg_sn: string
  msg_idx: number
  msg_mid: number
  msg_title: string
  msg_desc: string
  msg_link: string
  msg_source_url?: string
  msg_cover: string
  msg_publish_time: string
  msg_type: string
  mp_links?: { title: string; href: string }[]
  tags?: { id: string; url: string; name: string; count: number }[]
  repost_meta?: { account_name: string }
}

export interface ProgramOptions {
  url: string
  template?: string
  imageDir?: string
}
