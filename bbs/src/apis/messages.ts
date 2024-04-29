import request, { commonUrl } from '@/apis/request'
import {
  ChatConversation,
  ChatMessageList,
  MessageList,
  MessagesSummary,
} from '@/common/interfaces/response'
import { Notification } from '@/common/interfaces/response'

export const getMessagesSummary = () => {
  return request.get<MessagesSummary>(`${commonUrl}/messages/summary`)
}

export const getNotifications = (params: { kind?: string; page?: number }) => {
  return request.get<MessageList<Notification>>(
    `${commonUrl}/messages/notifications`,
    {
      params,
    }
  )
}

export const readNotification = (id: number, kind?: string) =>
  request.post(`${commonUrl}/messages/notifications/read/${id}`, undefined, {
    params: {
      ...(kind && { kind }),
    },
  })

export const getChatList = (params: { page?: number }) => {
  return request.get<MessageList<ChatConversation>>(
    `${commonUrl}/messages/chat/list`,
    {
      params,
    }
  )
}

export type ChatMessagesRequest = {
  uid?: number
  chatId?: number
  chatList?: boolean
  page?: number
  dateline?: number
  messageId?: number
  newer?: boolean
}

export const getChatMessages = ({
  uid,
  chatId,
  chatList,
  messageId,
  newer,
  ...params
}: ChatMessagesRequest) => {
  return request.get<ChatMessageList>(
    `${commonUrl}/messages/chat/${uid ? `user/${uid}` : chatId}`,
    {
      params: {
        ...params,
        chat_list: chatList ? 1 : 0,
        newer: newer ? 1 : 0,
        ...(messageId && { message_id: messageId }),
      },
    }
  )
}

export const sendChatMessage = (params: {
  usernames?: string[]
  conversation_id?: number
  subject?: string
  message: string
}) => request.post(`${commonUrl}/messages/chat`, params)
