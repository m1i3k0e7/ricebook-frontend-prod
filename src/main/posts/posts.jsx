import { Card, CardHeader, CardContent, CardMedia, CardActions, Avatar, Typography, Divider, Button, Dialog, DialogContent, DialogTitle, Box, OutlinedInput, DialogActions, Backdrop } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CircularProgress from '@mui/material/CircularProgress';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import './posts.css'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../auth/axios";
import CommentComponent from "./commentComponent";;

axios.defaults.withCredentials = true;

function Post({user, author, authorDisplayName, articleId, date, content, comments, displayName, image, textOnly}) {
    const navigate = useNavigate();
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState('');
    const [addedComments, setAddedComments] = useState([]);
    const [editing, setEditing] = useState(false);
    const [editCommentId, setEditCommentId] = useState(-1);
    const [openEdit, setOpenEdit] = useState(false);
    const [editPostContent, setEditPostContent] = useState('');
    const [showedContent, setShowedContent] = useState(content);
    const [avatar, setAvatar] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenEdit = () => {
        setEditPostContent(showedContent);
        setOpenEdit(true);
    }

    const handleCloseEdit = () => {
        setEditPostContent('');
        setOpenEdit(false);
        setUploadedFile(null);
    }

    const toProfilePage = () => {
        navigate('/profile');
    }

    const handleCloseComment = () => {
        setShowComment(false);
    }
    
    const handleOpenComment = () => {
        setShowComment(true);
    }

    const editArticle = async () => {
        if (editPostContent === '' && !uploadedFile) {
            return;
        }

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
                setImageUrl(res.data.imageUrl);
                await axios.put('/articles/' + articleId, { text: editPostContent, image: res.data.imageUrl })
            } finally {
                setUploadedFile(null);
                setSubmitting(false);
                handleCloseEdit();
                setEditPostContent('');
                setShowedContent(editPostContent);
            }
        } else if (editPostContent !== showedContent) {
            try {
                await axios.put('/articles/' + articleId, { text: editPostContent });
            } finally {
                handleCloseEdit();
                setEditPostContent('');
                setShowedContent(editPostContent);
                setSubmitting(false);
            }
        } else {
            handleCloseEdit();
            setEditPostContent('');
        }
    }

    const addComment = async () => {
        if (comment === '') {
            return;
        }

        if (editing) {
            editComment(editCommentId);
            return;
        }

        try {
            await axios.put('/articles/' + articleId, { text: comment, commentId: -1 })
        } finally {
            setAddedComments([...addedComments, [displayName, user, comment]]);
            setComment('');
            setSubmitting(false);
        }
    }

    const editComment = async (commentId) => {
        try {
            await axios.put('/articles/' + articleId, { text: comment, commentId: commentId });
            setAddedComments(addedComments.map((c, id) => {
                if (id === commentId) {
                    return [displayName, user, comment];
                }
                return c;
            }));
        } finally {
            setEditing(false);
            setEditCommentId(-1);
            setComment('');
            setSubmitting(false);
        }
    }

    useEffect(() => {
        setAddedComments(comments);
    }, [comments]);

    useEffect(() => {
        setImageUrl(image);
    }, [image]);

    useEffect(() => {
        axios.get('/avatar/' + author).then((res) => {
            setAvatar(res.data.avatar);
        });
    }, []);

    return (
            <Card className="post-container" sx={{borderRadius: '10px'}}>
                <CardHeader
                    avatar={
                    <IconButton onClick={toProfilePage} disabled={user !== author}>
                    <Avatar src={avatar}/>
                    </IconButton>
                    }
                    title={ <Typography variant="subtitle1">
                                {<b>{authorDisplayName}</b>}
                            </Typography>}
                    subheader={date.substring(0, 10) + ' ' + date.substring(11, 19)}
                    action={
                        user === author ? <IconButton size="large" onClick={handleOpenEdit}>
                            <EditIcon />
                        </IconButton> : <></>
                    }
                    style={{padding: '10px'}}
                />
                <CardContent style={{paddingTop: '10px'}}>
                    <Typography variant="body1">
                        {showedContent}
                    </Typography>
                </CardContent>
                {textOnly ? <></> : <CardMedia
                    component="img"
                    height="400"
                    image={imageUrl}
                    alt="Paella dish"
                />}
                <Divider variant="middle" style={{padding: '5px'}}/>
                <CardActions>
                    <Button className="post-button" color="gray" onClick={handleOpenComment}><CommentIcon className="post-button-icon"/>Comment</Button>
                </CardActions>
                <Dialog
                    open={showComment}
                    onClose={handleCloseComment}
                    style={{position: 'absolute', top: '-300px'}}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexGrow: 1, textAlign: 'center' }}>Comments</span>
                            <IconButton className='close-button' onClick={handleCloseComment}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <Divider/>
                    <DialogContent sx={{width: '500px'}}>
                        {addedComments.map((comment, id) => {
                            return (<CommentComponent key={id} editing={editing} editCommentId={editCommentId} setEditing={setEditing} setComment={setComment} setEditCommentId={setEditCommentId} id={id} user={user} displayName={displayName} comment={comment}/>);
                        })}
                        <Divider sx={{marginBottom: "10px"}}/>
                        <OutlinedInput
                            endAdornment={
                                <InputAdornment position="end">
                                    {
                                        editing ? <IconButton onClick={() => {
                                            setEditing(false);
                                            setComment('');
                                            setEditCommentId(-1);
                                        }}>
                                            <DeleteForeverIcon />
                                        </IconButton> : <></>
                                    }
                                    <IconButton onClick={addComment}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                            fullWidth
                            onChange={(e) => {
                                setComment(e.target.value);
                            }}
                            value={comment}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={openEdit}
                    onClose={handleCloseEdit}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ flexGrow: 1, textAlign: 'center' }}>Edit Post</span>
                            <IconButton className='close-button' onClick={handleCloseEdit}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <Divider/>
                    <DialogContent className='post-input-form'>
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={submitting}
                        handleClose={() => {}}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                        <textarea 
                            className='post-input-form-textfield' 
                            placeholder="What's on your mind?" 
                            height={200}
                            value={editPostContent}
                            onChange={(e) => {
                                setEditPostContent(e.target.value);
                            }}
                        />
                    </DialogContent>
                    {uploadedFile ? <div style={{position: 'relative', display: 'flex', left: '15px'}}><AttachFileIcon /><a>{uploadedFile.name}</a></div> : <></>}
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button variant="contained" sx={{width: '90%', height: '45px', marginBottom: '10px'}} disabled={editPostContent === ""} onClick={editArticle}>Submit</Button>
                        <IconButton 
                            style={{bottom: '5px', width: '45px', height: '45px'}}
                            onClick={() => {
                                setEditPostContent('');
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
            </Card>
    );
}

export default Post;