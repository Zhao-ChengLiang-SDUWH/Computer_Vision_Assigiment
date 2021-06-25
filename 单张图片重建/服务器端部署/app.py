'''
Demo code for the paper

Choy et al., 3D-R2N2: A Unified Approach for Single and Multi-view 3D Object
Reconstruction, ECCV 2016
'''
import os
import sys
if (sys.version_info < (3, 0)):
    raise Exception("Please follow the installation instruction on 'https://github.com/chrischoy/3D-R2N2'")

import shutil
import numpy as np
from subprocess import call

import torch

from PIL import Image
from models import load_model
from lib.config import cfg, cfg_from_list
from lib.data_augmentation import preprocess_img
from lib.solver import Solver
from lib.voxel import voxel2obj


DEFAULT_WEIGHTS = 'output/ResidualGRUNet/default_model/checkpoint.pth'
from flask import Flask, request,send_from_directory
import json
img_list=[]
#import requests
cfg_from_list(['CONST.BATCH_SIZE', 1])
app = Flask(__name__)

def cmd_exists(cmd):
    return shutil.which(cmd) is not None


def load_demo_images(img_list):
    img_h = cfg.CONST.IMG_H
    img_w = cfg.CONST.IMG_W
    
    imgs = []
    
    for path in img_list:
        img = Image.open(path)
        img = img.resize((img_h, img_w), Image.ANTIALIAS)
        img = preprocess_img(img, train=False)
        imgs.append([np.array(img).transpose( \
                        (2, 0, 1)).astype(np.float32)])
   # img = Image.open('imgs/test5.png')
   # img = img.resize((img_h, img_w), Image.ANTIALIAS)
    #img = preprocess_img(img, train=False)

   # imgs=[[np.array(img).transpose((2, 0, 1)).astype(np.float32)]]
    ims_np = np.array(imgs).astype(np.float32)
    return torch.from_numpy(ims_np)


def main(img_list,obj_name):
    '''Main demo function'''
    # Save prediction into a file named 'prediction.obj' or the given argument
    pred_file_name = sys.argv[1] if len(sys.argv) > 1 else obj_name

    # load images
    demo_imgs = load_demo_images(img_list)

    # Use the default network model
    NetClass = load_model('ResidualGRUNet')

    # Define a network and a solver. Solver provides a wrapper for the test function.
    net = NetClass()  # instantiate a network
    if torch.cuda.is_available():
        net.cuda()

    net.eval()

    solver = Solver(net)                # instantiate a solver
    solver.load(DEFAULT_WEIGHTS)

    # Run the network
    voxel_prediction, _ = solver.test_output(demo_imgs)
    voxel_prediction = voxel_prediction.detach().cpu().numpy()
    path=os.path.join('pred_result',pred_file_name)
    # Save the prediction to an OBJ file (mesh file).
    voxel2obj(path, voxel_prediction[0, 1] > cfg.TEST.VOXEL_THRESH)

    # Use meshlab or other mesh viewers to visualize the prediction.
    # For Ubuntu>=14.04, you can install meshlab using
    # `sudo apt-get install meshlab`
    if cmd_exists('meshlab'):
        call(['meshlab', pred_file_name])
    else:
        print('Meshlab not found: please use visualization of your choice to view %s' %
              pred_file_name)


@app.route('/', methods=['GET', 'POST'])
def index():
    global img_list
    return_dict = {'return_code': '404', "return_info": "xxx"}
    get_Data = request.form.to_dict()
    print(get_Data)
    # 传入的参数为bytes类型，需要转化成json
    # get_Data=json.loads(get_Data)
    # print(get_Data)
    is_over = int(get_Data["is_over"])
   # flag2 = int(get_Data["flag2"])
    if request.method == 'POST':
        f = request.files['file']
        image_path = os.path.join('test_img', f.filename)
        f.save(image_path)
        img_list.append(image_path)
        if is_over==1:
            obj_name=f.filename[:-3]+'obj'
            print(img_list)
            print(obj_name)
            main(img_list,obj_name)
            img_list=[]
            return send_from_directory('pred_result',obj_name)
    return json.dumps(return_dict)
if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5678)
    
   
    
