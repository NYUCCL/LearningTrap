from random import shuffle, randint, random
from itertools import combinations
from math import exp
import numpy as np

def generate_abstract_stims(ndim):
    powers = [pow(2, i) for i in range(ndim)]
    # abstract values for each of dimensions
    stimset =  [[(num/place)%2 for place in powers] for num in range(2 ** ndim)]
    return stimset

def generate_physical_stims(counterbalance, ndim, stimset):
    # mapping of pysical stim images to abstract structure: first choose two
    # dimensions to be relevant, based on counterbalance
    possible_relevant_dims = list(combinations(range(ndim), 2))
    rel_dimmapping = list(possible_relevant_dims[counterbalance])
    # then make remaining dimensions irrelevant
    irrel_dimmapping = [i for i in range(ndim) if i not in rel_dimmapping]
    # shuffle within each group
    shuffle(rel_dimmapping)
    shuffle(irrel_dimmapping)
    # combine lists
    dimmapping = rel_dimmapping + irrel_dimmapping
    # randomly swap which physical attribute is "1" and which is
    # "0" for each dimension
    swaps = np.array([randint(0, 1) for _ in range(ndim)])
    # produce the physical stimulus numbers that are now linked
    # with each abstract stim number
    phys_stimnums = [sum(np.multiply([pow(2, i) for i in dimmapping],
                                     abs(np.array(s)-swaps))) for s in stimset]
    return dimmapping, swaps, phys_stimnums


def stimuli_generator(condition, counterbalance, numblocks, numtestblocks, ndim=4,
                      good_payoff=1, bad_payoff=-3,
                      fullinfo=False, individuate=False, obscure=False, longhorizon=False,
                      noisy=False, intervention_b1=0, intervention_l1=0,
                      intervention_b2=7, intervention_l2=0, **kwargs):
    nstim = 2 ** ndim
    #abstract stimulus labels
    stimnums = range(nstim)
    # abstract stimulus dimension values
    stimset = generate_abstract_stims(ndim)
    # stimulus good/bad values (0 bad, 1 good)
    stimtypes = [0 for _ in range(nstim/4)] + [1 for _ in range(nstim-nstim/4)]
    # stimulus payoffs
    ap_payoff = [good_payoff if s == 1 else bad_payoff for s in stimtypes]
    # generate a mapping of abstract stimuli to physical stimuli (length ndim),
    # a mapping of which abstract dims swap their 0 and 1 values when
    # transforming to physical dim space (length ndim),
    # and a mapping of which physical stimnum goes with each abstract stimnum (length len(stimnums))
    dimmapping, swaps, phys_stimnums = generate_physical_stims(counterbalance, ndim, stimset)
    # generate an individuation value for each stimulus (shuffled version of stimnums)
    indiv_values = range(nstim)
    shuffle(indiv_values)

    trialnum = 0
    exp_definition = []
    for b in range(numblocks):
        if numblocks - b <= numtestblocks:
            test = True
        else:
            test = False
        blockcontents = []
        stims = stimnums

        # set proportion of items that will have intervention applied for this
        # block intervention starts at intervention_l1 up until
        # intervention_b1, then steadily changed to level intervention_l2 at
        # block intervention_b2
        intervention_progress = float(b - intervention_b1)/(intervention_b2 - intervention_b1)
        if intervention_progress <= 0:
            intervention_level = intervention_l1
        elif intervention_progress > 0 and intervention_progress < 1:
            intervention_level = intervention_progress * intervention_l2 + \
                                 (1 - intervention_progress) * intervention_l1
        else:
            intervention_level = intervention_l2
        intervention_vec = np.random.rand(len(stimnums)) < intervention_level

        ap_payoff_block = ap_payoff[:]
        stimtype_block = stimtypes[:]
        if noisy and not test:
            for i in range(nstim):
                if intervention_vec[i]:
                    if ap_payoff_block[i] == good_payoff:
                        ap_payoff_block[i] = bad_payoff
                        stimtype_block[i] = 0
                    else:
                        ap_payoff_block[i] = good_payoff
                        stimtype_block[i] = 1
        indiv_values_block = [-1] * nstim
        if individuate and not test:
            for i in range(nstim):
                if intervention_vec[i]:
                    indiv_values_block[i] = indiv_values[i]
        obscured_values_block = [False] * nstim
        if obscure and not test:
            for i in range(nstim):
                if intervention_vec[i]:
                    obscured_values_block[i] = True


        for s in stims:
            stim = {'block': b,
                    'stimnum': s,
                    'imagenum': phys_stimnums[s],
                    'category': stimtypes[s],
                    'category_withnoise': stimtype_block[s],
                    'condition': condition,
                    'counterbalance': counterbalance,
                    'fullinfo': int(fullinfo),
                    'obscure': int(obscure),
                    'individuate': int(individuate),
                    'longhorizon': int(longhorizon),
                    'ap_payoff': ap_payoff_block[s],
                    'av_payoff': 0,
                    'indiv_value': indiv_values_block[s],
                    'intervention': int(intervention_vec[s] and not test),
                    'test': int(test),
                    'phase': 'experiment',
            }
            dimensionvals = stimset[s]
            for idx, d in enumerate(dimensionvals):
                stim['dim' + str(idx)] = d
            for idx, d in enumerate(swaps):
                stim['swapdim' + str(idx)] = d
            for idx, d in enumerate(dimmapping):
                stim['physdim' + str(idx)] = d
            physdimensionvals = stimset[phys_stimnums[s]]
            for idx, d in enumerate(physdimensionvals):
                stim['physdimval' + str(idx)] = d
            if obscured_values_block[s]:
                num = randint(0, ndim-1)
                stim['obscureNum'] = num
                stim['obscureNumPhys'] = dimmapping[num]
            else:
                stim['obscureNum'] = -1
                stim['obscureNumPhys'] = -1
            blockcontents.append(stim)
        shuffle(blockcontents)
        for i in range(len(blockcontents)):
            blockcontents[i]['trial'] = trialnum
            trialnum += 1
        exp_definition.append(blockcontents)
    return exp_definition
