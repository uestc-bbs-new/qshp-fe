import request, { commonUrl } from '@/apis/request'

import { CollectionQueryResponse } from './types/collection'

export const getCollectionDetails = ({
  id,
  page,
  order,
  details,
}: {
  id: number
  page?: number
  order?: 'post' | 'collect'
  details?: boolean
}) =>
  request.get<CollectionQueryResponse>(`${commonUrl}/collection/${id}`, {
    params: {
      ...(page && { page }),
      ...(order == 'collect' && { order: 1 }),
      ...(details && { details: 1 }),
    },
  })
