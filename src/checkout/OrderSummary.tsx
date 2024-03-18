import { Text, Stack } from "@mantine/core";
import classes from "./OrderSummary.module.css";
import "@mantine/core/styles.css";

interface ContactIconProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  title: React.ReactNode;
  description: React.ReactNode;
}

function OrderSummary({ title, description, ...others }: ContactIconProps) {
  return (
    <div className={classes.wrapper} {...others}>
      <div>
        <Text size="xs" className={classes.title}>
          {title}
        </Text>
        <Text className={classes.description}>{description}</Text>
      </div>
    </div>
  );
}

const MOCKDATA = [
  { title: "Event:", description: "Maccabi Haifa match" },
  { title: "Tickets:", description: "2 X Gold Seats" },
  { title: "Original Price:", description: "100$" },
  { title: "Discaunt:", description: "0$" },
  { title: "Price After Discaunt:", description: "Total: 100$" },
];

export function OrderSummaryList() {
  const items = MOCKDATA.map((item, index) => (
    <OrderSummary key={index} {...item} />
  ));
  return <Stack>{items}</Stack>;
}
