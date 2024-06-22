import { useParams } from 'react-router-dom'

import Thread from './Thread'
import User from './User'

const Search = () => {
  const type = useParams()['type'] || 'thread'
  if (type == 'thread') {
    return <Thread />
  } else {
    return <User />
  }
}

export default Search
