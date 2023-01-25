# Next.js SSR with remult

This repo was created based on the [Build a Full-Stack Next.js Application
](https://remult.dev/tutorials/react-next/) tutorial

To use remult in the `getServerSideProps` functions, there are some subtleties that need to be handled

1. We need a remult object on the server configured according to the current request (user info etc...)
2. We need to serialize the result to simple JSON, that next can send to the render function.

## Step 1 - add `withRemult` function to api
To use remult in the `getServerSideProps` let's first add a utility function to the `src/server/api.ts` file
```ts
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";

export function withRemult<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
>(
  getServerPropsFunction: GetServerSideProps<P, Q, D>
): GetServerSideProps<P, Q, D> {
  return (context: GetServerSidePropsContext<Q, D>) => {
    return new Promise<GetServerSidePropsResult<P>>((res, err) => {
      api.withRemult(context, undefined!, async () => {
        try {
          let r = await getServerPropsFunction(context);
          res(JSON.parse(JSON.stringify(r)));
        } catch (e) {
          err(e);
        }
      });
    });
  };
}
```

## Wrap the `getServerSideProps` call

Consider the following code, which shows a next.js component that uses `getServerSideProps` to get data from the server:
*src/index.tsx*
```ts
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
```

To adjust it to use remult we'll wrap the `getServerSideProps` function with a call to the `withRemult` function we've added in step 1 and then we can use `remult` in it and everything will work:
```ts
export const getServerSideProps: GetServerSideProps<HomeProps> = withRemult(
  async (context) => {
    return {
      props: {
        tasks: await remult.repo(Task).find(),
      },
    };
  }
);
```

We can even make this shorter since the type definition can be inferred:
```ts
export const getServerSideProps = withRemult<HomeProps>(
```

* Please note, that next js has a limitation for sending non json objects (such as dates etc...) through server side props, if you need that, you'll need to handle that just like any other next project

