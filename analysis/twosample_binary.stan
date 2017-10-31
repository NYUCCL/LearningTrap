data {
  int<lower=0> N;
  int cc[N];
  int y[N];
}

parameters {
  vector<lower=0, upper=1>[2] cond_mu;
}

model {
  vector[N] p;
  cond_mu ~ beta(2, 2);
  for (n in 1:N) {
    p[n] = cond_mu[cc[n]];
  }
  y ~ bernoulli(p);
}
