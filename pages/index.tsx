import React from "react";
import { Task } from "../src/shared/Task";
import { withRemult } from "../src/server/api";
import { remult } from "remult";

type HomeProps = {
  tasks: Task[];
};

export const getServerSideProps = withRemult<HomeProps>(async (context) => {
  return {
    props: {
      tasks: await remult.repo(Task).find(),
    },
  };
});

const Home: React.FunctionComponent<HomeProps> = ({ tasks }) => {
  return (
    <>
      <h1>Tasks</h1>
      <ul>
        {tasks?.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </>
  );
};
export default Home;
