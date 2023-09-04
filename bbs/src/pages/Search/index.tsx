import React, { useEffect, useState } from 'react'

import ResultForPost from './ResultForPost'
import ResultForUsers from './ResultForUsers'
import { useLocation } from 'react-router-dom'

const Search = () => {
  const params = new URLSearchParams(window.location.search)

  const [name, setName] = useState(params.get('name') || null)
  const [type, setType] = useState(params.get('type') || 'post')
  const [page, setPage] = useState(params.get('page') || 1)
  const pageSize = 10

  let location = useLocation();
  useEffect(() => {
    setName(location.search.split('=')[2])
    setType(location.search.split('=')[1].split('&')[0])
    // setPage(location.search.split('=')[3])
  }, [location]);

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
  }
  else {
    return (
      <ResultForUsers
        name={name}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setName={setName}
      />
    )
  }
}

export default Search
