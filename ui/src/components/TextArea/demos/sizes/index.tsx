import { TextArea, Grid } from '@platform-blocks/ui';

export default function Demo() {

  return (
    <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={16} fullWidth>
      <TextArea
        placeholder="Extra small (xs)"
        size="xs"
        height={100}
      />
      <TextArea
        placeholder="Small (sm)"
        size="sm"
        height={100}
      />
      <TextArea
        placeholder="Medium (md)"
        size="md"
        height={100}
      />
      <TextArea
        placeholder="Large (lg)"
        size="lg"
        rows={3}
      />
      <TextArea
        placeholder="Extra large (xl)"
        size="xl"
        rows={3}
      />
    </Grid>
  );
}