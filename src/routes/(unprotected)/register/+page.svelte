<script>
  import { enhance } from '$app/forms';
  import { Button, Card, Checkbox, Fieldset, Form, Input } from '$components';

  // utilities
  const setUsernameDeleteTimer = () => {
    setTimeout(() => {
      username = '';
    }, 3000);
  };

  // props (internal)
  let isAdmin = false;
  let firstName = '';
  let lastName = '';
  let password = 'ABTL1234$';
  let username = '';

  $: if (username !== '') setUsernameDeleteTimer();
</script>

<Card>
  <Form
    class="max-w-[320px]"
    use={[
      [
        enhance,
        () => {
          return async ({ result }) => {
            firstName = '';
            lastName = '';
            username = result.data.username;
          };
        }
      ]
    ]}
  >
    <div class="text-[1.875rem] font-semibold">Register</div>
    <div class="min-h-[1.5rem] text-green-500">
      {#if username !== ''}
        Successfully added username "{username}"
      {/if}
    </div>
    <Fieldset legend="First Name">
      <Input bind:value={firstName} name="firstName" />
    </Fieldset>
    <Fieldset legend="Last Name">
      <Input bind:value={lastName} name="lastName" />
    </Fieldset>
    <Fieldset legend="Password">
      <Input bind:value={password} name="password" type="password" />
    </Fieldset>
    <Checkbox bind:checked={isAdmin} name="isAdmin">Is Admin?</Checkbox>
    <a
      class="hover:text-blue-500 focus:text-blue-500 hover:underline focus:underline outline-none transition duration-200"
      href="/sign-in">Sign In</a
    >
    <Button type="submit">Register</Button>
  </Form>
</Card>
