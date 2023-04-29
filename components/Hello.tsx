type Props = {
    name: string;
  };
  
  const Hello = ({ name }: Props) => {
    return <h1 className="text-3xl font-bold">Hello, {name}!</h1>;
  };
  
  export default Hello;
  