import styles from "../styles/Home.module.css";
import { GetServerSideProps } from "next";
import React from "react";
import { Task } from "../src/shared/Task";

type HomeProps = {
  tasks: Task[];
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  return {
    props: {
      tasks: [],
    },
  };
};

const Home: React.FunctionComponent<HomeProps> = ({ tasks }) => {
  return (
    <>
      <main className={styles.main}>
        <h1>Tasks</h1>
        <ul>
          {tasks?.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </main>
    </>
  );
};
export default Home;
