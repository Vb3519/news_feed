import { Card, List, Tag, Typography, Space, Spin, Row, Col } from 'antd';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';

// React-icons:
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';

// State:
import {
  selectNewsList,
  selectIsLoadingViaApi,
  selectPagination,
  increasePaginationVal,
  loadNewsData,
} from './redux/slices/newsListSlice';

// Types:
import { AppDispatch } from './redux/store';
import { useEffect } from 'react';

const App = () => {
  const dispatch: AppDispatch = useDispatch();

  const { Title, Paragraph, Text } = Typography;

  const newsList = useSelector(selectNewsList);
  const isLoading: boolean = useSelector(selectIsLoadingViaApi);
  const pagination: number = useSelector(selectPagination);

  const URL: string = `https://dummyjson.com/posts?limit=10&skip=${pagination}`;

  const handleLoadNewsData = () => {
    dispatch(loadNewsData(URL));
  };

  // Загрузка дополнительных новостных постов:
  // --------------------------------------------
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  const handleIncreasePaginationVal = () => {
    dispatch(increasePaginationVal(10));
  };

  useEffect(() => {
    if (pagination === 0 && newsList.length === 0) {
      handleLoadNewsData();
      handleIncreasePaginationVal();
      return;
    }

    if (inView && !isLoading && pagination !== 0) {
      handleIncreasePaginationVal();
      handleLoadNewsData();
    }
  }, [inView, pagination]);

  return (
    <div style={{ padding: '24px 10%', maxWidth: 1200, margin: '0 auto' }}>
      {newsList.length ? (
        <>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={newsList}
            renderItem={(newsPost) => (
              <List.Item key={newsPost.id}>
                <Card hoverable>
                  <Title level={4}>{newsPost.title}</Title>

                  <Paragraph ellipsis={{ rows: 3 }}>{newsPost.body}</Paragraph>

                  <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col>
                      <Space size={[8, 8]} wrap>
                        {newsPost.tags.map((tag, index) => (
                          <Tag key={index} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </Col>

                    <Col>
                      <Space size="large">
                        <Space direction="vertical" align="center" size={2}>
                          <Text>{newsPost.reactions.likes}</Text>
                          <LikeOutlined style={{ fontSize: 20 }} />
                        </Space>
                        <Space direction="vertical" align="center" size={2}>
                          <Text>{newsPost.reactions.dislikes}</Text>
                          <DislikeOutlined style={{ fontSize: 20 }} />
                        </Space>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />

          <div ref={ref} style={{ height: 1 }} />

          {isLoading && newsList.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Spin tip="...Загружаем еще новости...">
                <div style={{ height: 50 }} />
              </Spin>
            </div>
          )}
        </>
      ) : (
        <Title level={4} style={{ textAlign: 'center' }}>
          ...Нет данных по текущим новостям...
        </Title>
      )}
    </div>
  );
};

export default App;
