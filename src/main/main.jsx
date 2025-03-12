import authReducer, { searchPosts } from '../auth/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import './main.css';
import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import MoodIcon from '@mui/icons-material/Mood';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Post from './posts/posts';
import { CircularProgress, AppBar, Paper, Box, Avatar, Button, Divider, Card, CardHeader, Typography, Dialog, DialogActions, DialogContent, DialogTitle, OutlinedInput, Alert, Backdrop } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ProfileField from './profileField';
import { addFollowing, addPost, getFollowings, getHeadline, getInitialPosts, getPosts, putHeadline, removeFollowing, userGetCredential } from '../auth/authAction';
import FollowingComponent from './followingComponent';
import axios from '../auth/axios';

axios.defaults.withCredentials = true;

function Main() {
    let store = configureStore({ reducer: { auth: authReducer } });
    const { userInfo, loading, loadingPosts, posts, followings, showedPosts, headline } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [followingState, setFollowings] = useState([]);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [uid, setUid] = useState(0);
    const [status, setStatus] = useState("");
    const [openPostInput, setOpenPostInput] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [openStatusInput, setOpenStatusInput] = useState(false);
    const [statusContent, setStatusContent] = useState("");
    const [enableSearch, setEnableSearch] = useState(false);
    const [searchPost, setSearchPosts] = useState("");
    const [showedPostState, setShowedPosts] = useState([]);
    const [followingToAdd, setFollowingToAdd] = useState("");
    const [openAddFollowing, setOpenAddFollowing] = useState(false);
    const [followErrMsg, setFollowErrMsg] = useState("");
    const [showFollowErr, setShowFollowErr] = useState(false);
    const [pageSkip, setPageSkip] = useState(0);
    const [userCred, setUserCred] = useState(null);
    const [loadingToken, setLoadingToken] = useState(true);
    const [avatar, setAvatar] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const scrollToBottom = () => {
        window.scrollTo({
            top: Math.max(
              document.body.scrollHeight,
              document.documentElement.scrollHeight
            )
        });
    };

    const fetchNewPosts = () => {
        const userToken = localStorage.getItem('userToken');

        dispatch(getPosts({ userToken, followings: followingState, skip: pageSkip })).then((myPosts) => {
            if (myPosts.payload.length === 0) {
                scrollToBottom();
                return;
            }
            scrollToBottom();
            setPageSkip(pageSkip + myPosts.payload.length);
        });
    }

    const handleEnableSearch = () => {
        setEnableSearch(true);
    }

    const handleCloseSearch = () => {
        setEnableSearch(false);
        setSearchPosts("");
    }

    const handleOpenPostInput = () => {
        setOpenPostInput(true);
    };

    const handleClosePostInput = () => {
        setOpenPostInput(false);
        setPostContent("");
        setUploadedFile(null);
    };

    const handleOpenStatus = () => {
        setOpenStatusInput(true);
    }

    const handleCloseStatus = () => {
        setOpenStatusInput(false);
        setStatusContent("");
    }

    const handleopenAddFollowing = () => {
        setOpenAddFollowing(true);
    }
    
    const handleCloseAddFriend = () => {
        setOpenAddFollowing(false);
        setFollowingToAdd("");
        setShowFollowErr(false);
        setFollowErrMsg("");
    }

    const submitPost = async () => {
        const text = postContent;
        let image = "";
        if (uploadedFile) {
            const imageId = crypto.randomUUID()
            try {
                setSubmitting(true);
                const formData = new FormData();
                formData.append('image', uploadedFile);
                formData.append('title', imageId);
                const res = await axios.put('/articleImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                dispatch(addPost({ text, image: res.data.imageUrl }));
            } finally {
                setUploadedFile(null);
            }
        } else {
            setSubmitting(true);
            dispatch(addPost({ text, image }));
        }
        setSubmitting(false);
        handleClosePostInput();
        handleCloseSearch();    
    }

    const submitStatus = () => {
        dispatch(putHeadline({ headline: statusContent })).then(() => {;
            setStatus(statusContent);
            handleCloseStatus();
        });
    }

    const addNewFollowing = () => {
        if (followingToAdd === '')
            return;

        if (followingState.find(f => f.username === followingToAdd)) {
            handleCloseAddFriend();
            return;
        }

        if (followingToAdd === username) {
            setFollowErrMsg("You cannot follow yourself.");
            setShowFollowErr(true);
            return;
        }

        const followingName = followingToAdd;
        dispatch(addFollowing({ followingName })).then((res) => {
            if (res.type === 'auth/following/rejected') {
                setFollowErrMsg(res.payload);
                setShowFollowErr(true);
                return;
            }
            handleCloseAddFriend();
            setEnableSearch(false);
            setSearchPosts("");
        });
    }

    const unfollow = (followingName) => {
        dispatch(removeFollowing({ followingName })).then((res) => {
            setEnableSearch(false);
            setSearchPosts("");
        });
    }

    const toProfilePage = () => {
        navigate('/profile');
    }

    useEffect(() => {
        axios.get('/isLoggedIn').catch((e) => {
            navigate('/');
        }).then(() => {
            if (!localStorage.getItem('userToken')) {
                axios.get('/userToken').then((res) => {
                    localStorage.setItem('userToken', res.data.token);
                    setLoadingToken(false);
                });
            } else {
                setLoadingToken(false);
            }
        });
    });

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        if (!loading && userToken) {
            const [id, user, _] = userToken.split('_');
            setUsername(user);
            setUid(Number(id));
            
            dispatch(getFollowings({ userToken })).then((myFollowings) => {
                setFollowings(myFollowings.payload);
            });

            dispatch(getHeadline()).then((headline) => {
                setStatus(headline.payload);
            });

            dispatch(userGetCredential({ userToken })).then((cred) => {
                setDisplayName(cred.payload.displayName);
                setUserCred(cred.payload);
                setAvatar(cred.payload.avatar);
            });
        }
    }, [loading, loadingToken]);

    useEffect(() => {
        setFollowings(followings);
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            return;
        }
        
        dispatch(getInitialPosts({ userToken, followings })).then((myPosts) => {
            setShowedPosts(myPosts.payload);
            setPageSkip(myPosts.payload.length);
        });
    }, [followings]);

    useEffect(() => {
        dispatch(searchPosts({searchVal: searchPost}));
    }, [searchPost])

    useEffect(() => {
        setShowedPosts(showedPosts);
    }, [showedPosts]);

    return (
        (loading || loadingToken) ? 
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop> 
                    : 
                    !localStorage.getItem('userToken') ? <Navigate to='/'></Navigate> 
                    :
                    <div>
                        <style>{'body { background-color: rgb(240, 242, 245); }'}</style>
                        <AppBar>
                            <Toolbar className='navbar'>
                                <img
                                    className='ricebook-logo' 
                                    src='https://seeklogo.com/images/R/rice-university-athletic-logo-818A1AFD94-seeklogo.com.png' 
                                    onClick={() => {
                                        navigate('/main');
                                    }}
                                />
                                <Grid sx={{ flexGrow: 1 }}></Grid>
                                <Grid container sx={{ flexGrow: 1 }}>
                                    <div className='navbar-button-container-select'>
                                        <Button className='navbar-button'>
                                            <HomeIcon fontSize="large" className='navbar-button-icon-select'/>
                                        </Button>
                                    </div>
                                    <div className='navbar-button-container'>
                                        <Button className='navbar-button' onClick={toProfilePage}>
                                            <PersonIcon fontSize="large" className='navbar-button-icon'/>
                                        </Button>
                                    </div>
                                </Grid>
                                <Grid sx={{ flexGrow: 1 }}></Grid>
                                <ProfileField username={displayName} status={status} avatar={avatar}></ProfileField>
                            </Toolbar>
                        </AppBar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Toolbar/>
                            <Grid container spacing={1}>
                                <Grid size={3.5} style={{position: 'fixed'}}>
                                    <Card style={{border: 'none', boxShadow: "none"}}>
                                        <CardHeader
                                            title={<Typography variant='h6' style={{color: "#606266"}}>Followings</Typography>}
                                            action={
                                                <div>
                                                    <IconButton onClick={handleopenAddFollowing} >
                                                        <SearchIcon/>
                                                    </IconButton>
                                                </div>
                                              }
                                            className='following-title'
                                        />
                                    </Card>
                                    <Divider variant='middle' style={{margin: '3px', borderBottomWidth: '1.5px'}}/>
                                    <div style={{overflowY: 'auto', height: 'calc(100vh - 150px)'}}>
                                        {followingState.map((following, id) => {
                                            return (<FollowingComponent key={following.username} following={following} unfollow={unfollow}></FollowingComponent>);
                                        })}
                                    </div>
                                </Grid>
                                <Grid size={5} style={{marginLeft: '29.5%'}}>
                                    <Paper className='input-container' sx={{borderRadius: '10px'}}>
                                        <div 
                                            className='inline-display' 
                                            onClick={() => {

                                            }}
                                        >
                                            <IconButton onClick={toProfilePage}>
                                                <Avatar src={avatar}></Avatar>
                                            </IconButton>
                                            <div className='input-textfield inline-display' onClick={handleOpenPostInput}>{displayName}: {status}</div>
                                            {enableSearch ? <input 
                                                                className='search-post-field' 
                                                                placeholder='Search posts'
                                                                value={searchPost}
                                                                onChange={(e) => {
                                                                    setSearchPosts(e.target.value);
                                                                }}
                                                            /> 
                                                          : <></>
                                            }
                                        </div>
                                        <Divider style={{paddingTop: '10px'}}></Divider>
                                        <Grid container>
                                            <Grid size={4} className="button-container">
                                                <Button className='post-button' onClick={handleOpenPostInput}>
                                                    <CropOriginalIcon className='post-button-icon'/>
                                                    <Typography style={{color: 'rgb(96, 98, 102)'}}>Photos</Typography>
                                                </Button>
                                            </Grid>
                                            <Grid size={4} className="button-container" onClick={handleOpenStatus}>
                                                <Button className='post-button'>
                                                    <MoodIcon className='post-button-icon'/>
                                                    <Typography style={{color: 'rgb(96, 98, 102)'}}>Status</Typography>
                                                </Button>
                                            </Grid>
                                            <Grid size={4} className="button-container">
                                                <Button 
                                                        className='post-button' 
                                                        onClick={() => {
                                                            if (enableSearch) {
                                                                handleCloseSearch();
                                                            } else {
                                                                handleEnableSearch();
                                                            }
                                                        }}>
                                                    <SearchIcon className='post-button-icon'/>
                                                    <Typography style={{color: 'rgb(96, 98, 102)'}}>Search</Typography>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                    { loadingPosts ? <CircularProgress color="inherit" style={{display: 'block', marginLeft: '45%', marginTop: '30%'}}/>: 
                                                    <div className='posts-container'>
                                                        {showedPostState.map((post, id) => {
                                                            return (<Post key={post._id} user={username} displayName={displayName} articleId={post._id} author={post.author} authorDisplayName={post.authorDisplayName} content={post.text} date={post.date} comments={post.comments} image={post.image} textOnly={post.image===''}></Post>);
                                                        })}
                                                    </div> 
                                    }
                                    { (enableSearch || loadingPosts) ? <></> : <IconButton style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }} onClick={fetchNewPosts}><KeyboardArrowDownIcon style={{fontSize: '40px'}}></KeyboardArrowDownIcon></IconButton> }
                                </Grid>
                                <Grid size={3.5}></Grid>
                            </Grid>
                        </Box>
                        <Dialog
                            open={openPostInput}
                            onClose={handleClosePostInput}
                        >
                            <DialogTitle>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ flexGrow: 1, textAlign: 'center' }}>New Post</span>
                                    <IconButton className='close-button' onClick={handleClosePostInput}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </DialogTitle>
                            <Divider/>
                            <DialogContent className='post-input-form'>
                            <Backdrop
                                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                                open={submitting}
                                handleclose={() => {}}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                                <Card style={{border: 'none', boxShadow: "none", display: 'flex'}}>
                                    <CardHeader
                                        sx={{padding: '0px', margin: '0px', marginBottom: '10px'}}
                                        avatar={
                                            <Avatar src={avatar} />
                                        }
                                        title={<Typography variant='h6'>{displayName}</Typography>}
                                    />
                                </Card>
                                <textarea 
                                    className='post-input-form-textfield' 
                                    placeholder="What's on your mind?" 
                                    height={200} 
                                    onChange={(e) => {
                                        setPostContent(e.target.value);
                                    }}
                                    value={postContent}
                                />
                            </DialogContent>
                            {uploadedFile ? <div style={{position: 'relative', display: 'flex', left: '15px'}}><AttachFileIcon /><a>{uploadedFile.name}</a></div> : <></>}
                            <DialogActions sx={{ justifyContent: 'center' }}>
                                <Button variant="contained" sx={{width: '90%', height: '45px', marginBottom: '10px'}} disabled={postContent === ""} onClick={submitPost}>Post</Button>
                                <IconButton 
                                    style={{bottom: '5px', width: '45px', height: '45px'}}
                                    onClick={() => {
                                        setPostContent("");
                                        setUploadedFile(null);
                                    }}
                                >
                                    <DeleteForeverIcon style={{height: '42px', width: '42px'}}/>
                                </IconButton>
                                <label>
                                    <IconButton component="span" style={{bottom: '5px', width: '45px', height: '45px'}}>
                                        <InsertPhotoIcon style={{height: '40px', width: '40px'}}/>
                                    </IconButton>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            setUploadedFile(e.target.files[0]);
                                        }}
                                    />
                                </label>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={openStatusInput}
                            onClose={handleCloseStatus}
                        >
                            <DialogTitle>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ flexGrow: 1, textAlign: 'center' }}>New Status</span>
                                    <IconButton className='close-button' onClick={handleCloseStatus}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </DialogTitle>
                            <Divider/>
                            <DialogContent className='post-input-form'>
                                <Card style={{border: 'none', boxShadow: "none"}}>
                                    <CardHeader
                                        sx={{padding: '0px', margin: '0px', marginBottom: '10px'}}
                                        avatar={
                                            <Avatar src={avatar} />
                                        }
                                        title={<Typography variant='h6'>{displayName}</Typography>}
                                    />
                                </Card>
                                <textarea 
                                    className='post-input-form-textfield' 
                                    placeholder='Change your status' 
                                    height={200} 
                                    onChange={(e) => {
                                        setStatusContent(e.target.value);
                                    }}
                                    value={statusContent}
                                />
                            </DialogContent>
                            <DialogActions sx={{ justifyContent: 'center' }}>
                                <Button variant="contained" sx={{width: '90%', height: '45px', marginBottom: '10px'}} disabled={statusContent === ""} onClick={submitStatus}>Submit</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={openAddFollowing}
                            onClose={handleCloseAddFriend}
                            style={{position: 'absolute', top: '-300px'}}
                        >
                            <DialogTitle>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ flexGrow: 1, textAlign: 'center' }}>Add New Following</span>
                                    <IconButton className='close-button' onClick={handleCloseAddFriend}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </DialogTitle>
                            <Divider/>
                            <DialogContent sx={{width: '500px'}}>
                                <OutlinedInput
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={addNewFollowing}>
                                                <AddIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    fullWidth
                                    onChange={(e) => {
                                        setFollowingToAdd(e.target.value);
                                    }}
                                    value={followingToAdd}
                                />
                                {showFollowErr ? <Alert 
                                    severity="error" onClose={() => {
                                        setFollowErrMsg("");
                                        setShowFollowErr(false);
                                    }} 
                                    style={{marginTop: '10px'}}
                                    >
                                    {followErrMsg}
                                </Alert> : <></>}
                            </DialogContent>
                        </Dialog>
                    </div>
    )
}

export default Main;


// const addPosts = (authorId, authorName, newest) => {
//     fetch('https://jsonplaceholder.typicode.com/posts')
//     .then(res => res.json())
//     .then(posts => {
//         const userPosts = posts.filter(post => post.userId == authorId);
//         for (let i = 0; i < userPosts.length; i++) {
//             userPosts[i]['author'] = authorName;
//             userPosts[i]['comments'] = [];
//             fetch('https://jsonplaceholder.typicode.com/users')
//             .then(res => res.json())
//             .then(users => {
//                 for (let j = 1; j <= 3; j++) {
//                     const following = users.filter(user => user.id == (authorId + j) % 10);
//                     const bodies = ['Nice!', 'Good!', 'Love it!'];
//                     userPosts[i]['comments'].push({'author': following[0].username, 'body': bodies[[Math.floor(Math.random() * bodies.length)]]});
//                 }
//             });
//         }
//         setEnableSearch(false);
//         setSearchPosts("");
//         if (newest) {
//             setPosts(prev => userPosts.concat([...prev]));
//         } else {
//             setPosts(prev => [...prev].concat(userPosts));
//         }
//     });
// }

// const getCurrentDate = () => {
//     const date = new Date();
//     let day = date.getDate();
//     let month = date.getMonth() + 1;
//     let year = date.getFullYear();
//     let hour = date.getHours();
//     let minute = date.getMinutes();

//     let currentDate = `${year}-${month}-${day} ${hour}:${minute}`;

//     return currentDate;
// }