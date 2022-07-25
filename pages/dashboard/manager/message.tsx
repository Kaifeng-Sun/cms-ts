import React, { useState } from 'react'
import { useListEffect } from '../../../components/custom-hooks/list-effect';
import Layout from '../../../components/layout/layout'
import { MessagesRequest, MessagesResponse, Message, MessageType } from '../../../lib/model/message';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';

export default function Page() {
  const [type, setType] = useState<MessageType>(null as any);
  const { paginator, setPaginator, data, hasMore } = useListEffect<
    MessagesRequest,
    MessagesResponse,
    Message
  >(apiService.getMessages.bind(apiService), 'messages', true, { type , userId: storage.userId });
  return (
    <>
      <Layout>
        
      </Layout>
    </>
  )
}
