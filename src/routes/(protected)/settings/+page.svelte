<script>
  import { enhance } from '$app/forms';
  import { Button, Fieldset, Form, Input } from '$components';

  // props (external)
  export let data;
  export let form;
</script>

<div class="flex flex-grow flex-col overflow-auto space-y-[1rem] p-[1rem]">
  <div>Settings</div>
  <div class="min-h-[1.5rem] text-green-500">
    {#if form?.success}
      Successfully updated current inventory version to "{form?.inventoryVersion}."
    {/if}
  </div>
  <Form class="items-start" use={[enhance]}>
    <Fieldset legend="Inventory Version">
      <Input bind:value={data.settings.inventoryVersion} name="inventoryVersion" />
    </Fieldset>
    <Button type="submit">Update</Button>
  </Form>
</div>
