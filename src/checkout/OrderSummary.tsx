import { Text, Stack } from "@mantine/core";
import classes from "./OrderSummary.module.css";
import "@mantine/core/styles.css";

interface ContactIconProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  title: React.ReactNode;
  description: React.ReactNode;
}

interface OrderDetail {
  title: string;
  description: any;
}

interface OrderSummaryListProps {
  orderDetails: OrderDetail[];
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

export function OrderSummaryList(props: OrderSummaryListProps) {
  const items = props.orderDetails.map((item, index) => (
    <OrderSummary key={index} {...item} />
  ));
  return <Stack>{items}</Stack>;
}
