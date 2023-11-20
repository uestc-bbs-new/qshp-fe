import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import ResultForPost from './ResultForPost'
import ResultForUsers from './ResultForUsers'

const Search = () => {
  const params = new URLSearchParams(window.location.search)

  const [name, setName] = useState(params.get('name') || null)
  const [type, setType] = useState(params.get('type') || 'post')
  const [page, setPage] = useState(params.get('page') || 1)
  const pageSize = 18

  const location = useLocation()
  useEffect(() => {
    setName(decodeURI(location.search.split('=')[2]))
    setType(location.search.split('=')[1].split('&')[0])
    // setPage(location.search.split('=')[3])
  }, [location])

  if (type == 'post') {
    return (
      <ResultForPost
        name={name}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setName={setName}
      />
    )
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
