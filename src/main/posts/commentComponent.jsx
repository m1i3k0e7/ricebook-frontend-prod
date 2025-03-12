import { useEffect, useState } from "react";
import { IconButton, Avatar, Chip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from "../../auth/axios";

axios.defaults.withCredentials = true;

function CommentComponent({editing, editCommentId, setEditing, setComment, setEditCommentId, id, user, displayName, comment}) {
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        axios.get('/avatar/' + comment[1]).then((res) => {
            setAvatar(res.data.avatar);
        });
    }, []);

    return (
        <div style={{marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
            <Avatar style={{marginRight: '10px'}} src={avatar} />
            <Chip label={comment[0] + ': ' + comment[2]} />
            {
                comment[1] === user ? <IconButton style={{position: 'absolute', right: '15px'}} onClick={() => { 
                    if (editing && editCommentId === id) {
                        setEditing(false);
                        setComment('');
                        setEditCommentId(-1);
                        return;
                    }
                    setEditing(true);
                    setComment(comment[2]);
                    setEditCommentId(id);
                }}>
                    { editCommentId === id ? <EditNoteIcon /> : <EditIcon /> }
                </IconButton> : <></>
            }
        </div>
    );
}

export default CommentComponent;