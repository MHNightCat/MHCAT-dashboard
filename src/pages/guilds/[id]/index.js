/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Col, Avatar, Card, Text, Button, Modal, Row } from '@nextui-org/react';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import { GetUserGuilds } from '../../../util/fetchapi/GetUserGuilds';
import { BiErrorCircle } from 'react-icons/bi';
import Link from 'next/link';
import { BsDiscord } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { getSession } from 'next-auth/react';
import { GetGuild } from '../../../util/fetchapi/GetGuild';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import GetRedisUserGuilds from '../../../util/redis/GetRedisUserGuilds';
import GetRedisGuild from '../../../util/redis/GetRedisGuild';
import { MdWork } from 'react-icons/md';
import { AiFillWarning } from 'react-icons/ai';
import {MdKeyboardVoice} from 'react-icons/md'

const PathData = [
  {
    id: 'welcome',
    name: '歡迎系統',
    icon: <BsFillDoorOpenFill />,
    Des: '在你的成員加入你的伺服器時給他一些驚喜吧!',
  },
  {
    id: 'work',
    name: '打工系統',
    icon: <MdWork />,
    Des: '獨特的打工系統，讓你可以簡單的使用打工系統來讓你的伺服器獲得更多的趣味性!',
  },
  {
    id: 'voice',
    name: '語音系統',
    icon: <MdKeyboardVoice />,
    Des: '當你某個人違反伺服器規則時，你可你會需要紀錄，這個功能能夠很好的幫助你紀錄，還譨自動刪除'
  },
  {
    id: 'warn',
    name: '警告系統',
    icon: <AiFillWarning />,
    Des: '當你某個人違反伺服器規則時，你可你會需要紀錄，這個功能能夠很好的幫助你紀錄，還譨自動刪除'
  }
];

export default function GuildsPage(data) {
  //如果是403狀態就跳轉回主頁
  const router = useRouter();
  if (data.status === '401') return router.push('/');

  const [hasPermission, sethasPermission] = useState(
    data.status === '403' ? true : false
  );
  const [hasGuild, sethasGuild] = useState(
    data.status === '404' ? true : false
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={2.5}
          columns={{ xs: 2, sm: 6, md: 12, lg: 16 }}
        >
          {PathData.map((data) => (
            <>
              <Grid xs={2} sm={3} md={4} lg={4} key={data.id}>
                <Card
                  isHoverable
                  css={{ position: 'relative', height: '200px' }}
                >
                  <Card.Header>
                    <Box sx={{ border: '2px solid', borderRadius: '10px' }}>
                      <IconButton
                        aria-label="delete"
                        size="medium"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        {data.icon}
                      </IconButton>
                    </Box>
                    <Grid xs={12}>
                      <Text h4 css={{ lineHeight: '$xs' }}>
                        {data.name}
                      </Text>
                    </Grid>
                  </Card.Header>
                  <Card.Body css={{ py: '$2' }}>
                    <Text>{data.Des}</Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      size="sm"
                      color="primary"
                      icon={data.icon}
                      onClick={() => {
                        router.push(`/guilds/${router.query.id}/${data.id}`); // 使用 router.push() 來導航到其他頁面
                      }}
                    >
                      {data.name}
                    </Button>
                  </Card.Footer>
                </Card>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
      <Modal blur preventClose aria-labelledby="modal-title" open={hasGuild}>
        <Modal.Header css={{ alignContent: 'center', justifyItems: 'center' }}>
          <Text id="modal-title" size={18}>
            我找不到這個伺服器QQ
          </Text>
        </Modal.Header>
        <Modal.Body css={{ textAlign: 'center' }}>
          <Text id="modal-title" size={15}>
            麻煩請先將我放到你的伺服器裡呦!
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Link
            href="https://discord.com/api/oauth2/authorize?client_id=964185876559196181&permissions=8&scope=bot%20applications.commands"
            target="_blank"
            style={{ width: '100%' }}
          >
            <Button
              auto
              icon={<BsDiscord fill="currentColor" />}
              css={{ width: '100%', backgroundColor: '#5765f2' }}
            >
              立即邀請我到你的伺服器
            </Button>
          </Link>
          <Link href="/" style={{ width: '100%' }}>
            <Button
              auto
              color="warning"
              icon={<AiFillHome fill="currentColor" />}
              css={{ width: '100%' }}
            >
              返回選擇頁面
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
      <Modal
        blur
        preventClose
        aria-labelledby="modal-title"
        open={hasPermission}
      >
        <Modal.Header css={{ alignContent: 'center', justifyItems: 'center' }}>
          <BiErrorCircle size={22}></BiErrorCircle>
          <Text id="modal-title" size={18}>
            找不到這個伺服器!
          </Text>
        </Modal.Header>
        <Modal.Body css={{ textAlign: 'center' }}>
          <Text id="modal-title" size={15}>
            可能是因為你沒有權限讀取這個伺服器喔
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Link href="https://discord.gg/7g7VE2Sqna" target="_blank">
            <Button
              shadow
              color="secondary"
              auto
              icon={<BsDiscord fill="currentColor" />}
            >
              回報錯誤
            </Button>
          </Link>
          <Link href="/">
            <Button
              shadow
              color="primary"
              auto
              icon={<AiFillHome fill="currentColor" />}
            >
              重新選擇
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const session = await getSession(ctx);
  if (!session)
    return {
      props: {
        status: '401',
      },
    };
  const guildsData = await GetRedisUserGuilds(session.id);
  const isFound = guildsData.some((element) => {
    if (element.id === query.id) {
      return true;
    }
    return false;
  });
  if (isFound) {
    const GuildData = await GetRedisGuild(session.id, query.id);
    return {
      props: {
        status: `${GuildData.status === '404' ? '404' : '200'}`,
      },
    };
  } else {
    return {
      props: {
        status: '403',
      },
    };
  }
}
