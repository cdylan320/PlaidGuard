import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
// import { auth } from '@/lib/auth'
import { UserSession } from '@/lib/types'
import { getMissingKeys } from '@/app/actions/chat';
import { getFullUserInfo } from '@/app/actions/auth';

export const metadata = {
  title: 'Next.js AI Chatbot'
}

export default async function IndexPage() {
  const id = nanoid()
  // const session = await auth()
  const session = await getFullUserInfo();
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session as UserSession} missingKeys={missingKeys} />
    </AI>
  )
}
