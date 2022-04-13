import './PhotoView.css'
import {useEffect, useState} from "react";
import {photoService} from "../service/PhotoService";
import {
    Container,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    TextField
} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";

export const PhotoView = () => {
    const perPageList = [5,10,20,30]

    const [photos, setPhotos] = useState()
    const [totalPages, setTotalPages] = useState()
    const [totalPhotos, setTotalPhotos] = useState()

    const [query, setQuery] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPerPage, setCurrentPerPage] = useState(10)

    useEffect(() => {
        if (query !== undefined) {
            photoService.searchPhoto(query, currentPage, currentPerPage).then((res) => {
                setTotalPhotos(res.data.total)
                setPhotos(res.data.results)
                setTotalPages(res.data.total_pages)
            })
        }
    }, [query, currentPage, currentPerPage])

    useEffect(() => {
        setCurrentPage(1)
        setCurrentPerPage(10)
    }, [query])

    const SearchPhotoField = () => {
        const [localQuery, setLocalQuery] = useState(query)

        const queryOnChange = (event) => {
            setLocalQuery(event.target.value)
        }

        const queryOnEnterClick = (event) => {
            if (event.key === 'Enter') {
                searchPhoto()
            }
        }

        const searchPhoto = () => {
            setQuery(localQuery)
        }

        return (
            <Paper className={'search-container'} elevation={2}>
                <TextField
                    value={localQuery}
                    fullWidth
                    onChange={queryOnChange}
                    onKeyDown={queryOnEnterClick}
                    placeholder={'Search photo'}
                    InputProps={{
                        endAdornment: <InputAdornment position={'end'}>
                            <SearchOutlined
                                className={'search-button'}
                                onClick={searchPhoto}
                            />
                        </InputAdornment>,
                    }}
                />
                <PerPageDropdown />
            </Paper>
        )
    }

    const PerPageDropdown = () => {
        const handleChange = (event) => {
            setCurrentPerPage(event.target.value)
        }

        return (
            <div className={'page-dropdown-container'}>
                <FormControl fullWidth>
                    <InputLabel>Per Page</InputLabel>
                    <Select
                        value={currentPerPage}
                        label={'Per Page'}
                        onChange={handleChange}
                    >
                        {perPageList.map((perPage) => <MenuItem key={perPage} value={perPage}>{perPage}</MenuItem>)}
                    </Select>
                </FormControl>
            </div>
        )
    }

    const PhotoPagination = ({totalPages}) => {
        const handleChange = (event, value) => {
            setCurrentPage(value)
        }

        return (
            <div className={'pagination-container'}>
                <span>{`Showing ${currentPerPage} of ${totalPhotos} results.`}</span>
                <Pagination onChange={handleChange} page={currentPage} count={totalPages} variant={'outlined'} />
            </div>
        )
    }

    const Thumbnails = ({photos}) => (
        <Grid container spacing={2}>
            {photos.map((photo, i) => (
                <Grid key={i} className={'photo-container'} item xs={4}>
                    <Paper className={'photo-thumbnail-container'} elevation={1}>
                        <img className={'photo-thumbnail-img'} src={photo.urls.thumb} />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )

    return (
        <Container maxWidth={'lg'}>
            <SearchPhotoField />
            {totalPages && <PhotoPagination totalPages={totalPages} />}
            {photos && <Thumbnails photos={photos} />}
        </Container>
    )
}