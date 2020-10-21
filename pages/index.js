import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import api from '../services/api';

import styles from '../styles/Home.module.css';

export default function Home() {
  const [groups, setGroups] = useState();
  const [items, setItems] = useState();
  const [groupedItems, setGroupedItems] = useState();

  useEffect(() => {
    async function loadGroups() {
      const response = await api.get('/grupos');
      setGroups(response.data);
    }

    async function loadItems() {
      const response = await api.get('/itens');
      setItems(response.data);
    }

    loadGroups();
    loadItems();
  }, []);

  useEffect(() => {
    if (!groups || !items) {
      return;
    }

    const groupedItems = items.reduce((result, currentValue) => {
      const group = groups.find((g) => {
        return g.codigo === currentValue['grupo'];
      });

      if (!result[group?.descricao]) {
        result[group?.descricao] = [];
      }

      result[group?.descricao].push(currentValue);

      return result;
    }, {});

    setGroupedItems(groupedItems);
  }, [groups, items]);

  const keys = useMemo(() => groupedItems && Object.keys(groupedItems), [
    groupedItems,
  ]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Grupos</h1>
        <ul>
          {groups?.map((group) => (
            <li key={group.codigo}>{group.descricao}</li>
          ))}
        </ul>

        <hr />

        <h3>Separar por categoria</h3>
        {keys && (
          <ul>
            {keys.map((key) => {
              const item = groupedItems[key];
              return item.map((item) => (
                <>
                  <li key={Math.random().toString()}>
                    {item.descricao + ' - ' + key}
                  </li>
                </>
              ));
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
