import './PhotoView.css'
import {useEffect, useState} from "react";
import {photoService} from "../service/PhotoService";
import {
    AppBar,
    Container,
    CssBaseline,
    Dialog,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Pagination,
    Paper,
    Select,
    TextField,
    Toolbar
} from "@mui/material";
import {Favorite, HourglassDisabled, SearchOutlined} from "@mui/icons-material";

export const PhotoView = () => {
    const perPageList = [5,10,20,30]

    const [photos, setPhotos] = useState()
    const [totalPages, setTotalPages] = useState()
    const [totalPhotos, setTotalPhotos] = useState()

    const [query, setQuery] = useState('')
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
            <div className={'search-container'}>
                <span className={'search-label'}>Search Photos</span>
                <div className={'search-components-container'}>
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
                </div>
            </div>
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
            <Grid
                className={"pagination-container"}
                container
                spacing={2}
                display={"flex"}
                justifyContent={"flex-end"}
            >
                <Pagination
                    onChange={handleChange}
                    page={currentPage}
                    count={totalPages}
                    variant={"outlined"}
                />
            </Grid>
        )
    }

    const Thumbnails = ({photos}) => {
        const ThumbnailPhoto = ({photo, index}) => {
            const [showLikes, setShowLikes] = useState(false)
            const [showPhotoDialog, setShowPhotoDialog] = useState(false)

            const showLikeContainer = () => {
                setShowLikes(true)
            }

            const hideLikeContainer = () => {
                setShowLikes(false)
            }

            const showPhotoDetails = () => {
                setShowPhotoDialog(true)
            }

            const hidePhotoDetails = () => {
                setShowPhotoDialog(false)
            }

            const LikesContainer = () => (
                <span className={'photo-likes-container'}>
                    <Favorite style={{ color: 'white' }} />
                    <span className={'likes-span'}>{photo.likes}</span>
                </span>
            )

            return (
                <Grid key={index} className={'photo-container'} item xs={12} sm={6} md={4} lg={3}>
                    <Paper
                        className={'photo-thumbnail-container'}
                        elevation={1}
                        onMouseEnter={showLikeContainer}
                        onMouseLeave={hideLikeContainer}
                        onClick={showPhotoDetails}
                    >
                        <img
                            className={'photo-thumbnail-img'}
                            src={photo.urls.thumb}
                            title={photo['alt_description']}
                        />
                        {showLikes && <LikesContainer />}
                    </Paper>
                    <Dialog open={showPhotoDialog} onClose={hidePhotoDetails}>
                        <img src={photo.urls.full} />
                    </Dialog>
                </Grid>
            )
        }

        return (
            <Grid container spacing={2}>
                {photos.map((photo, i) => <ThumbnailPhoto key={i} photo={photo} index={i}/>)}
            </Grid>
        )
    }

    const NoResultFound  = () => (
        <div className={'no-result-found-container'}>
            <HourglassDisabled />
            <span className={'no-result-found-span'}>No result found</span>
        </div>
    )

    return (
        <div>
            <CssBaseline />
            <AppBar color={'inherit'}>
                <Toolbar>
                    <SearchPhotoField />
                </Toolbar>
            </AppBar>
            <Toolbar className={'top-bar'} />
            <Container>
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        {totalPhotos === 0 && query !== '' && <NoResultFound />}
                        {totalPages && (
                            <div className={"result-info-span"}>
                                {`Showing ${currentPerPage} out of ${totalPhotos} results.`}
                            </div>
                        )}
                        {photos && <Thumbnails photos={photos} />}
                        {totalPages && <PhotoPagination totalPages={totalPages} />}
                    </>
                )}
            </Container>
        </div>
    )
}