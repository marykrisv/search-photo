import './PhotoView.css'
import {useEffect, useState} from "react";
import {photoService} from "../service/PhotoService";
import {
    Container,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Pagination,
    Paper,
    Select,
    TextField
} from "@mui/material";
import {Favorite, SearchOutlined} from "@mui/icons-material";

export const PhotoView = () => {
    const perPageList = [5,10,20,30]

    const [photos, setPhotos] = useState()
    const [totalPages, setTotalPages] = useState()
    const [totalPhotos, setTotalPhotos] = useState()

    const [query, setQuery] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPerPage, setCurrentPerPage] = useState(10)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (query !== undefined) {
            setIsLoading(true)
            photoService.searchPhoto(query, currentPage, currentPerPage).then((res) => {
                setTotalPhotos(res.data.total)
                setPhotos(res.data.results)
                setTotalPages(res.data.total_pages)
                setIsLoading(false)
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
                <span>{`Showing ${currentPerPage} out of ${totalPhotos} results.`}</span>
                <Pagination onChange={handleChange} page={currentPage} count={totalPages} variant={'outlined'} />
            </div>
        )
    }

    const Thumbnails = ({photos}) => {
        const ThumbnailPhoto = ({photo, index}) => {
            const [showLikes, setShowLikes] = useState(false)

            const showLikeContainer = () => {
                setShowLikes(true)
            }

            const hideLikeContainer = () => {
                setShowLikes(false)
            }

            const LikesContainer = () => (
                <span className={'photo-likes-container'}>
                    <Favorite style={{ color: 'white' }} />
                    <span className={'likes-span'}>{photo.likes}</span>
                </span>
            )

            return (
                <Grid key={index} className={'photo-container'} item xs={4}>
                    <Paper
                        className={'photo-thumbnail-container'}
                        elevation={1}
                        onMouseEnter={showLikeContainer}
                        onMouseLeave={hideLikeContainer}
                    >
                        <img
                            className={'photo-thumbnail-img'}
                            src={photo.urls.thumb}
                            title={photo['alt_description']}
                        />
                        {showLikes && <LikesContainer />}
                    </Paper>
                </Grid>
            )
        }

        return (
            <Grid container spacing={2}>
                {photos.map((photo, i) => <ThumbnailPhoto photo={photo} index={i}/>)}
            </Grid>
        )
    }

    return (
        <Container maxWidth={'lg'}>
            <SearchPhotoField />
            {isLoading ? (
                <LinearProgress />
            ) : (
                <>
                    {totalPages && <PhotoPagination totalPages={totalPages} />}
                    {photos && <Thumbnails photos={photos} />}
                </>
            )}
        </Container>
    )
}