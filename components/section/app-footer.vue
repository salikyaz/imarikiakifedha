<template>
  <footer class="footer">
    <div
      class="container grid h-full grid-flow-row-dense gap-8 md:grid-flow-col auto-cols-max"
    >
      <div class="flex items-start space-x-2">
        <TelegramIcon class="w-4 h-auto" />
        <div class="flex flex-col text-sm leading-none">
          <span class="mb-1"></span>
          <a href="#" target="_blank">
            <strong></strong>
          </a>
        </div>
      </div>
      <div class="flex items-start space-x-2">
        <VkIcon class="w-4 h-auto" />
        <div class="flex flex-col text-sm leading-none">
          <span class="mb-1"></span>
          <a href="" target="_blank">
            <strong></strong>
          </a>
        </div>
      </div>
      <div class="flex items-start space-x-2">
        <EmailIcon class="w-4 h-auto" />
        <div class="flex flex-col text-sm leading-none">
          <span class="mb-1">Customer Care:</span>

          <strong>0790025098</strong>
          <a href="imarikakifedha990@gmail.com" target="_blank">
            <strong>imarikakifedha990@gmail.com</strong>
          </a>
        </div>
      </div>
      <div class="flex flex-col space-y-1 leading-none">
        <a href="#" class="font-semibold">
          © 2023 IMARIKA KIFEDHA. All rights reserved.
        </a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  @apply border-t-1 border-secondary py-5;
}
</style>
