<script>
	  import { useSWR } from "sswr";
	  const { data: posts } = useSWR('https://jsonplaceholder.typicode.com/posts')
</script>

{#if $posts}
  {#each $posts as post (post.id)}
    <h1>{post.title}</h1>
    <p>{post.body}</p>
  {/each}
{/if}