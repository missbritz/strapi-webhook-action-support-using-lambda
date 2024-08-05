FROM public.ecr.aws/lamdbda/node.js:20

COPY src/index.js ${LAMBDA_TASK_ROOT}

CMD ["index.handler"]