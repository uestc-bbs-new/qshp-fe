import React, { useState } from 'react'

import ResultForPost from './ResultForPost'
import ResultForUsers from './ResultForUsers'

const Search = () => {
  const params = new URLSearchParams(window.location.search)

  const [name, setName] = useState(params.get('name') || null)
  const [type, setType] = useState(params.get('type') || 'post')
  const [page, setPage] = useState(params.get('page') || 1)
  const pageSize = 18

  console.log(type)
  if (type == 'post') {
    return <ResultForPost />
  } else {
    return (
      <ResultForUsers
        target={name}
        page={page}
        pageSize={pageSize}
        searchType={type}
        setPage={setPage}
        setName={setName}
      />
    )
  }
}

export default Search
