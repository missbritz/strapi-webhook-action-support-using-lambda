FROM public.ecr.aws/lambda/nodejs:20

COPY src/index.mjs package.json ${LAMBDA_TASK_ROOT}

RUN npm install

CMD ["index.handler"]