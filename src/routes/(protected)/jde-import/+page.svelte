<script>
  import { enhance } from '$app/forms';
  import { Button, Fieldset, Form, Textarea } from '$components';

  // props (internal)
  let paste = '';

  // props (external)
  export let form;
  $: console.log(form);
</script>

<div class="flex flex-grow flex-col overflow-y-auto p-[1rem] space-y-[1rem]">
  <div>JDE Import</div>
  <Form class="flex-grow" use={[enhance]}>
    <div class="min-h-[1.5rem] text-green-500">
      {#if form?.success}
        Successfully added data for {form?.date}.
      {/if}
    </div>
    <Fieldset class="flex-grow" legend="Paste CSV">
      <Textarea bind:value={paste} class="flex-grow" name="paste" />
    </Fieldset>
    <Button class="self-end" type="submit">Submit</Button>
  </Form>
</div>
