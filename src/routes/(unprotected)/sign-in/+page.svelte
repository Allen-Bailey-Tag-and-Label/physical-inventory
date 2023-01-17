<script>
  import { enhance } from '$app/forms';
  import { Button, Card, Fieldset, Form, Input } from '$components';

  // props (internal)
  let password = '';
  let username = '';

  // props (external)
  export let form;
</script>

<Card>
  <Form use={[[enhance]]}>
    <div class="text-[1.875rem] font-semibold">Sign In</div>
    <div class="min-h-[1.5rem]">
      {#if form?.error !== undefined}
        <div class="text-red-500">
          {form?.error}
        </div>
      {/if}
    </div>
    <Fieldset legend="Username">
      <Input bind:value={username} name="username" />
    </Fieldset>
    <Fieldset legend="Password">
      <Input bind:value={password} name="password" type="password" />
    </Fieldset>
    <!-- <a
      class="hover:text-blue-500 focus:text-blue-500 hover:underline focus:underline outline-none transition duration-200"
      href="/reset-password">Forgot Password?</a
    > -->
    <Button type="submit">Sign In</Button>
  </Form>
</Card>
