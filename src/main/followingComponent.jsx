import { IconButton, Avatar, Typography, Card, CardHeader } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import axios from "../auth/axios";

axios.defaults.withCredentials = true;

function FollowingComponent({following, unfollow}) {
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        axios.get('/avatar/' + (following.username || following[0])).then((response) => {
            setAvatar(response.data.avatar);
        });
    }, []);


    return (<Grid size={12}>
                <Card style={{border: 'none', boxShadow: "none"}}>
                    <CardHeader
                        avatar={
                            <Avatar src={avatar} />
                        }
                        title={<Typography variant='subtitle1'>{following.displayName || following[1]}</Typography>}
                        subheader={<Typography variant='body2'>{following.headline || following[2]}</Typography>}
                        className='following-container'
                        action={
                            <IconButton onClick={() => {
                                unfollow(following.username);
                            }}>
                                <CloseIcon/>
                            </IconButton>
                        }
                    />
                </Card>
            </Grid>
            );
}

export default FollowingComponent;